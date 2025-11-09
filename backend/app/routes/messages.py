from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from typing import List
from app.database.database import get_db
from app.routes.auth import get_current_user
from app.models import Conversation, Message, RealEstateObject, User
from app.schemas.message import ConversationCreate, ConversationResponse, MessageCreate, MessageResponse

router = APIRouter(prefix="/api/messages", tags=["messages"])


# ===== CONVERSATIONS =====

@router.post("/conversations", response_model=ConversationResponse)
def create_conversation(
    conv_data: ConversationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Создать или получить существующий диалог"""
    # Проверяем, что объект существует
    real_estate = db.query(RealEstateObject).filter(RealEstateObject.id == conv_data.real_estate_id).first()
    if not real_estate:
        raise HTTPException(status_code=404, detail="Объект недвижимости не найден")

    # Нельзя создать диалог с самим собой
    if real_estate.owner_id == current_user.id:
        raise HTTPException(status_code=400, detail="Нельзя создать диалог с собой")

    # Проверяем, существует ли уже диалог
    existing_conv = db.query(Conversation).filter(
        Conversation.real_estate_id == conv_data.real_estate_id,
        Conversation.buyer_id == current_user.id,
        Conversation.seller_id == real_estate.owner_id
    ).first()

    if existing_conv:
        response = ConversationResponse.from_orm(existing_conv)
        response.buyer_username = current_user.username
        if existing_conv.seller:
            response.seller_username = existing_conv.seller.username
        response.real_estate_title = real_estate.title
        response.unread_count = db.query(Message).filter(
            Message.conversation_id == existing_conv.id,
            Message.sender_id != current_user.id,
            Message.is_read == False
        ).count()
        return response

    # Создаем новый диалог
    conversation = Conversation(
        real_estate_id=conv_data.real_estate_id,
        buyer_id=current_user.id,
        seller_id=real_estate.owner_id
    )

    db.add(conversation)
    db.commit()
    db.refresh(conversation)

    response = ConversationResponse.from_orm(conversation)
    response.buyer_username = current_user.username
    if conversation.seller:
        response.seller_username = conversation.seller.username
    response.real_estate_title = real_estate.title
    response.unread_count = 0

    return response


@router.get("/conversations", response_model=List[ConversationResponse])
def get_my_conversations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Получить все мои диалоги"""
    conversations = db.query(Conversation).filter(
        or_(
            Conversation.buyer_id == current_user.id,
            Conversation.seller_id == current_user.id
        )
    ).order_by(Conversation.updated_at.desc()).all()

    result = []
    for conv in conversations:
        response = ConversationResponse.from_orm(conv)

        # Добавляем имена пользователей
        if conv.buyer:
            response.buyer_username = conv.buyer.username
        if conv.seller:
            response.seller_username = conv.seller.username
        if conv.real_estate:
            response.real_estate_title = conv.real_estate.title

        # Последнее сообщение
        last_msg = db.query(Message).filter(
            Message.conversation_id == conv.id
        ).order_by(Message.created_at.desc()).first()

        if last_msg:
            response.last_message = last_msg.content[:50] + "..." if len(last_msg.content) > 50 else last_msg.content

        # Количество непрочитанных
        response.unread_count = db.query(Message).filter(
            Message.conversation_id == conv.id,
            Message.sender_id != current_user.id,
            Message.is_read == False
        ).count()

        result.append(response)

    return result


# ===== MESSAGES =====

@router.post("/", response_model=MessageResponse)
def send_message(
    message_data: MessageCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Отправить сообщение"""
    # Проверяем, что диалог существует и пользователь является участником
    conversation = db.query(Conversation).filter(Conversation.id == message_data.conversation_id).first()
    if not conversation:
        raise HTTPException(status_code=404, detail="Диалог не найден")

    if conversation.buyer_id != current_user.id and conversation.seller_id != current_user.id:
        raise HTTPException(status_code=403, detail="Вы не являетесь участником этого диалога")

    # Создаем сообщение
    message = Message(
        conversation_id=message_data.conversation_id,
        sender_id=current_user.id,
        content=message_data.content,
        is_read=False
    )

    db.add(message)

    # Обновляем updated_at у диалога
    from datetime import datetime
    conversation.updated_at = datetime.utcnow()

    db.commit()
    db.refresh(message)

    response = MessageResponse.from_orm(message)
    response.sender_username = current_user.username

    return response


@router.get("/conversation/{conversation_id}", response_model=List[MessageResponse])
def get_conversation_messages(
    conversation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Получить все сообщения диалога"""
    # Проверяем права доступа
    conversation = db.query(Conversation).filter(Conversation.id == conversation_id).first()
    if not conversation:
        raise HTTPException(status_code=404, detail="Диалог не найден")

    if conversation.buyer_id != current_user.id and conversation.seller_id != current_user.id:
        raise HTTPException(status_code=403, detail="Вы не являетесь участником этого диалога")

    # Получаем сообщения
    messages = db.query(Message).filter(
        Message.conversation_id == conversation_id
    ).order_by(Message.created_at.asc()).all()

    # Помечаем сообщения как прочитанные (не свои)
    for msg in messages:
        if msg.sender_id != current_user.id and not msg.is_read:
            msg.is_read = True

    db.commit()

    result = []
    for msg in messages:
        response = MessageResponse.from_orm(msg)
        if msg.sender:
            response.sender_username = msg.sender.username
        result.append(response)

    return result


@router.put("/{message_id}/read")
def mark_as_read(
    message_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Пометить сообщение как прочитанное"""
    message = db.query(Message).filter(Message.id == message_id).first()
    if not message:
        raise HTTPException(status_code=404, detail="Сообщение не найдено")

    # Можно пометить только не свои сообщения
    if message.sender_id == current_user.id:
        raise HTTPException(status_code=400, detail="Нельзя пометить свое сообщение")

    message.is_read = True
    db.commit()

    return {"message": "Сообщение помечено как прочитанное"}

from flask import Blueprint, jsonify, request, session
from auth.decarators import giris_kontrolu
from database import db
from models.bildirim import Bildirim

bildirim_routes= Blueprint("bildirim_routes",__name__,url_prefix="/api")

@bildirim_routes.route("/bildirim", methods=["GET"])
@giris_kontrolu
def list_bildirim():
    user_id=session.get("user_id")
    only_unread=(request.args.get("only_unread")or "0")=="1"
    
    q= Bildirim.query.filter(Bildirim.user_id==user_id)
    if only_unread:
        q=q.filter(Bildirim.is_read==False)
    
    notifis= q.order_by(Bildirim.created_at.desc()).limit(30).all()
    
    unread_count=Bildirim.query.filter(Bildirim.user_id==user_id, Bildirim.is_read==False).count()

    return jsonify({
        "unread_count": unread_count,
        "bildirimler": [{
            "id": n.id,
            "type": n.type,
            "message": n.message,
            "is_read": n.is_read,
            "created_at": n.created_at.isoformat() if n.created_at else None,
            "ilgili_job_id": n.ilgili_is_id,
            "ilgili_application_id": n.ilgili_application_id,
        } for n in notifis]
    }),200
    


@bildirim_routes.route("/bildirim/<int:bildirim_id>/read",methods=["PATCH"])
@giris_kontrolu
def okundu_isaretle(bildirim_id):
    
    user_id= session.get("user_id")
    n=Bildirim.query.get(bildirim_id)
    
    if not n or n.user_id!= user_id:
        return 404
    
    n.is_read=True
    db.session.commit()
    return jsonify ({"message":"Okundu"}),200


@bildirim_routes.route("/bildirim/read_all",methods=["PATCH"])
@giris_kontrolu
def read_all():
    user_id=session.get("user_id")
    Bildirim.query.filter(
        Bildirim.user_id==user_id,
        Bildirim.is_read==False
    ).update({"is_read": True})
    db.session.commit()
    return jsonify({"message": "Tümü Okundu"}),200
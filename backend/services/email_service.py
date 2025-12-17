from flask_mail import Message

class EmailService:
    def __init__(self, mail):
        self.mail=mail
    
    def send_password_reset_email(self, to_email: str, reset_url: str):
        subject= "Şifre Sıfırlama Bağlantısı"
        body= f"""Merhaba, Şifrenizi Sıfırlamak için aşağıdaki bağlantıya tıklayın:
    {reset_url}
    Bu bağlantı 1 saat boyunca geçerlidir.
    Eğer bu işlemi siz yapmadıysanız bu e-postayı yok sayabilirsiniz.
        
    Freelance Platform
        """
        
        msg= Message(subject=subject, recipients= [to_email], body=body)
        self.mail.send(msg)
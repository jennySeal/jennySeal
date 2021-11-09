<?php
//Import PHPMailer classes into the global namespace
//These must be at the top of your script, not inside a function
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;

require './PHPMailer/Exception.php';
require './PHPMailer/PHPMailer.php';
require './PHPMailer/SMTP.php';


if
(empty($_REQUEST['name'])	|| empty($_REQUEST['email']) || empty($_REQUEST['message'])) {
	echo "No arguments Provided!";
    
   }


else {

    print_r($_REQUEST);
$name = $_REQUEST['name'];
$email_address = $_REQUEST['email'];
$message = $_REQUEST['message'];





//Create an instance; passing `true` enables exceptions
$mail = new PHPMailer(true);


    //Server settings
    $mail->SMTPDebug = SMTP::DEBUG_SERVER;                      //Enable verbose debug output
    $mail->isSMTP();                                            //Send using SMTP
    $mail->Host       = 'server295.web-hosting.com';                     //Set the SMTP server to send through
    $mail->SMTPAuth   = true;                                   //Enable SMTP authentication
    $mail->Username   = 'no-reply@jennyseal.com';                     //SMTP username
    $mail->Password   = 'Oma?Xb6#=1](';                               //SMTP password
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;            //Enable implicit TLS encryption
    $mail->Port       = 465;                                    //TCP port to connect to; use 587 if you have set `SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS`

    //Recipients
    $mail->setFrom('no-reply@jennyseal.com', 'Jenny Seal, Full Stack Developer');
    $mail->addAddress($email_address);               //Name is optional
    $mail->addReplyTo('no-reply@jennyseal.com', 'Jenny');
    $mail->addBCC('jennysealft@gmail.com');


    //Content
    $mail->isHTML(true);                                  //Set email format to HTML
    $mail->From = $email_address;
    $mail->Body    = '<h3>Hello</h3><p>Thank you very much for your message.</p><p>I will get back to you if appropriate at ' .  $email_address . '.<p>Your message read<br><b>' . $message .'</b>';
    $mail->AltBody = 'Hello. Thank you very much for your message. I will get back to you if appropriate at ' .  $email_address . '.Your message read' . $message;

    $mail->send();
    echo 'Message has been sent';
 
return true; }


?>

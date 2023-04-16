<?php
// if(isset($_POST['message'])){
//     $to      = 'info@matteomoscara.it';
//     $subject = $_POST['subject']; 
//     $message = $_POST['message']; 
//     $headers = "Da: ".$_POST['name']." <".$_POST['email'].">\r\n"; $headers = "Reply-To: ".$_POST['email']."\r\n"; 
//     $headers = "Content-type: text/html; charset=iso-8859-1\r\n";
//     'X-Mailer: PHP/' . phpversion();
//     if(mail($to, $subject, $message, $headers)) echo json_encode(['success'=>true]); 
//     else echo json_encode(['success'=>false]);
//     exit;
//  }

// Get form data
$name = $_POST['name'];
$email = $_POST['email'];
$subject = $_POST['subject'];
$message = $_POST['message'];

// Compose email message
$body = "Name: $name\n" .
        "Email: $email\n\n" .
        "Message:\n$message";

// Set recipient email address
$to = "info@matteomoscara.it"; // Replace with your recipient email address

// Set email headers
$headers = "From: $email\r\n";
$headers .= "Reply-To: $email\r\n";

// Send email
mail($to, $subject, $body, $headers);

// // Redirect to thank you page
// header("Location: thankyou.html"); // Replace with your thank you page URL

?>
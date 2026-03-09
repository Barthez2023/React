<?php
// Headers CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Gérer la requête preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Connexion à la base de données
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "hastane";

$conn = new mysqli($servername, $username, $password, $dbname);

// Vérifier la connexion
if ($conn->connect_error) {
    echo json_encode([
        "success" => false, 
        "message" => "Erreur de connexion: " . $conn->connect_error
    ]);
    exit();
}

// Récupérer les données JSON
$data = json_decode(file_get_contents("php://input"), true);

// Vérifier que les données existent
if (!$data) {
    echo json_encode([
        "success" => false, 
        "message" => "Aucune donnée reçue"
    ]);
    exit();
}

// Extraire les données avec vérification
$name = isset($data['Name']) ? $data['Name'] : '';
$surname = isset($data['SurName']) ? $data['SurName'] : '';
$birth = isset($data['Birth']) ? $data['Birth'] : '';
$email = isset($data['email']) ? $data['email'] : '';
$city = isset($data['city']) ? $data['city'] : '';
$district = isset($data['Il']) ? $data['Il'] : '';
$neighbourhood = isset($data['Ilce']) ? $data['Ilce'] : '';
$phone = isset($data['telephone']) ? $data['telephone'] : '';
$gender = isset($data['Cinsiyet']) ? $data['Cinsiyet'] : '';
$status = isset($data['Durum']) ? $data['Durum'] : '';

// Vérifier le mot de passe
if (!isset($data['password']) || empty($data['password'])) {
    echo json_encode([
        "success" => false, 
        "message" => "Mot de passe manquant"
    ]);
    exit();
}

$password = password_hash($data['password'], PASSWORD_DEFAULT);

// Vérifier que toutes les données obligatoires sont présentes
if (empty($name) || empty($surname) || empty($email)) {
    echo json_encode([
        "success" => false, 
        "message" => "Champs obligatoires manquants"
    ]);
    exit();
}

// Préparer la requête SQL
$sql = "INSERT INTO hastalar (Name, Surname, Birth, Email, City, District, Neighbour, Situation,Gender,Phone, password_hash)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode([
        "success" => false, 
        "message" => "Erreur de préparation: " . $conn->error
    ]);
    exit();
}

// CORRECTION CRITIQUE : "sssssssssss" = 11 strings
$stmt->bind_param("sssssssssss", $name, $surname, $birth, $email, $city, $district, $neighbourhood,$status, $gender, $phone, $password);

if ($stmt->execute()) {
    echo json_encode([
        "success" => true, 
        "message" => "Enregistrement réussi",
        "user_id" => $stmt->insert_id
    ]);
} else {
    echo json_encode([
        "success" => false, 
        "message" => "Erreur lors de l'enregistrement: " . $stmt->error
    ]);
}

$stmt->close();
$conn->close();
?>
<?php

include 'db_connect.php';
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data["id"])) {
    echo json_encode([
        "status" => "error",
        "message" => "ID is required"
    ]);
    exit();
}

$id = $data["id"];

$query = "DELETE FROM students WHERE id = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("i", $id);

if ($stmt->execute()) {
    echo json_encode([
        "status" => "success",
        "message" => "Data Deleted Successfully!"
    ]);
} else {
    echo json_encode([
        "status" => "error",
        "message" => "Failed to Delete Data"
    ]);
}

$stmt->close();
?>
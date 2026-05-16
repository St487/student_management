<?php

include 'db_connect.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode([
        "status" => "error",
        "message" => "No JSON data received"
    ]);
    exit;
}

$matric = $data["matric"];
$name = $data["name"];
$email = $data["email"];
$semester = $data["semester"];
$dob = $data["dob"];
$program = $data["program"];
$gender = $data["gender"];
$hobbies = $data["hobbies"];

$sql = "INSERT INTO students (matric_number, full_name, email, semester, date_of_birth, program, gender) VALUES ('$matric', '$name', '$email', '$semester', '$dob', '$program', '$gender')";

if ($conn->query($sql) === TRUE) {

    foreach ($hobbies as $hobby) {

        $get_hobby_id_sql = "SELECT id FROM hobbies WHERE hobby_name = '$hobby'";

        $hobby_result = $conn->query($get_hobby_id_sql);

        if ($hobby_result->num_rows > 0) {
            $hobby_id = $hobby_result->fetch_assoc()['id'];
        }

        $get_student_id_sql = "SELECT id FROM students WHERE matric_number = '$matric'";

        $student_result = $conn->query($get_student_id_sql);

        if ($student_result->num_rows > 0) {
            $student_id = $student_result->fetch_assoc()['id'];
        }

        $hobby_sql = "INSERT INTO student_hobbies (student_id, hobby_id) 
                      VALUES ('$student_id', '$hobby_id')";

        $conn->query($hobby_sql);
    }

    echo json_encode([
        "status" => "success",
        "message" => "Student added successfully"
    ]);

} else {
    echo json_encode([
        "status" => "error",
        "message" => "Error: " . $conn->error
    ]);
}

?>
<?php
include 'db_connect.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

$sql = "
SELECT 
    s.id,
    s.matric_number,
    s.full_name,
    s.email,
    s.semester,
    s.date_of_birth,
    s.gender,
    s.program,
    GROUP_CONCAT(h.hobby_name SEPARATOR ', ') AS hobbies

FROM students s

LEFT JOIN student_hobbies sh 
    ON s.id = sh.student_id

LEFT JOIN hobbies h 
    ON sh.hobby_id = h.id

GROUP BY s.id
";

$result = $conn->query($sql);

$students = array();

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $students[] = $row;
    }
}

echo json_encode($students);
?>
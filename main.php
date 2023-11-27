<?php


    // Header statements for API access
    header('Access-Control-Allow-Headers: Content-Type');
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
    header('Content-Type: application/json');
    // Set-up the connection
    $mysqli = mysqli_connect("localhost", "phpuser", "pa55word", "donutDB");

    // Make sure we established connection properly
    if(mysqli_connect_error()) {
        echo "Failed to connect to the server" . $mysqli->connect_error;
        die("There was an issue while attempting to connect to the database");
    }

    // store the request method
    $reqMethod = $_SERVER["REQUEST_METHOD"];

    // Handler for get requests
    if($reqMethod == 'GET') {

        // SQL query to fetch records from donuts table
        $query = "SELECT * FROM donuts";
        $res = $mysqli->query($query);

        $data = [];
        // Loop through each record and add it to array
        while ($row = $res->fetch_assoc()) {
            $data[] = $row;
        }
        // encode data into json format
        echo json_encode($data);
        
        // Handle post requests
    } elseif($reqMethod == 'POST') {

        // Retrieve json data sent in request
        $data = json_decode(file_get_contents("php://input"), true);
        // make a SQL statement to insert into database
        $statement = $mysqli->prepare("INSERT INTO donuts (ID, Name, Description, Price) VALUES (?, ?, ?, ?)");

        // bind the parameters given into the prepared statement and then execute
        $statement->bind_param("sssd", $data['ID'], $data['Name'], $data['Description'], $data['Price']);
        $statement->execute();

        // Send a confirmation message
        echo json_encode(array('message' => "Donut Successfully Added"));
    
    } elseif($reqMethod == 'PUT') {

        parse_str(file_get_contents("php://input"), $data);
        $statement = $mysqli->prepare("UPDATE donuts SET Name = ?, Description = ?, Price = ? WHERE ID = ?");

        $statement->bind_param("ssds", $data['Name'], $data['Description'], $data['Price'], $data['ID']);
        $statement->execute();

        echo json_encode(array('message' => "Donut Successfully Updated"));

    } elseif($reqMethod == 'DELETE') {
        
        parse_str(file_get_contents("php://input"), $data);
        $statement = $mysqli->prepare("DELETE FROM donuts WHERE ID = ?");

        $statement->bind_param("s", $data['ID']);
        $statement->execute();

        echo json_encode(array('message' => "Donut Has Been Deleted"));

    } else {
        // Respond with 405 code if the method isn't allowed
        http_response_code(405);
        echo json_encode(array('error' => 'Method Not Allowed'));
    }
    // close database connection
    $mysqli->close();

?>
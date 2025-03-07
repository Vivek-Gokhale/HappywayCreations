<?php
session_start();
/* if (isset($_SESSION['delivery_partner_id'])) {
    header('Location: dashboard.php');
    exit();
} */
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Change Password</title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
    <link rel="stylesheet" href="styles.css">
</head>

<body>
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-6">
                <div class="card">
                    <div class="card-header" style="background-color: darkgreen; color: white;">Change Password</div>
                    <div class="card-body">
                        <form action="change-pass-process.php" method="post">
                            <div class="form-group">
                                <label for="email">Old Password</label>
                                <input type="password" name="old-password" id="password" class="form-control" required>
                            </div>
                            <div class="form-group">
                                <label for="password">New Password</label>
                                <input type="password" name="new-password" id="password" class="form-control" pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}" title="Must contain at least one number, one uppercase and lowercase letter, one special character, and at least 8 or more characters" required>
                            </div>
                            <div class="form-group">
                                <label for="password">Confirm Password</label>
                                <input type="password" name="con-password" id="password" class="form-control" pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}" title="Must contain at least one number, one uppercase and lowercase letter, one special character, and at least 8 or more characters" required>
                            </div>
                            <button type="submit" class="btn btn-primary" style="background-color: darkgreen; color: white;">Change</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>

</html>
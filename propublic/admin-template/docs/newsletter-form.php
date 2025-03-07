<?php
session_start();
include "header.php";
?>
<!-- Sidebar menu-->
<?php
include 'aside.php';
include 'connection.php';
if (isset($_POST["submit"])) {
    $subject = mysqli_real_escape_string($conn, $_POST['nl_subject']);
    $content = mysqli_real_escape_string($conn, $_POST['nl_content']);
    $image = $_FILES['nl_image']['name'];
    $path = $_FILES['nl_image']['tmp_name'];


    $imageExtension = explode('.', $image);
    $imageExtension = strtolower(end($imageExtension));
    $newImageName = uniqid() . '.' . $imageExtension;

    $sql = "insert into newsletter (nl_subject,	nl_content,nl_image,status) values('$subject','$content','$newImageName','Pending')";

    if (mysqli_query($conn, $sql)) {
        echo "<script>window.location='newsletter-table.php';</script>";
        move_uploaded_file($path, "../../admin-template/docs/newsletter-uploads/" . $newImageName);
    } else {
        echo "Problem" . mysqli_error($conn);
    }
}
?>
<main class="app-content">
    <div class="app-title">
        <div>
            <h1><i class="fa fa-edit"></i>Newletter Form</h1>
        </div>
        <ul class="app-breadcrumb breadcrumb">
            <li class="breadcrumb-item"><i class="fa fa-home fa-lg"></i></li>
            <li class="breadcrumb-item">Forms</li>
            <li class="breadcrumb-item"><a href="#">Newletter Form</a></li>
        </ul>
    </div>
    <div class="col-md-6" style="text-align:left;">
        <div class="tile">
            <h3 class="tile-title">Newsletter Details</h3>
            <div class="tile-body">
                <form class="form-horizontal" method="post" enctype="multipart/form-data">
                    <div class="form-group row">
                        <label class="control-label col-md-3">Subject</label>
                        <div class="col-md-8">
                            <textarea class="form-control" placeholder="Enter subject" rows="5" cols="40" name="nl_subject"></textarea>
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="control-label col-md-3">Content (HTML Format)</label>
                        <div class="col-md-8">
                            <textarea class="form-control" placeholder="Enter content" rows="9" cols="40" name="nl_content"></textarea>
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="control-label col-md-3">Newsletter Image</label>
                        <div class="col-md-8">
                            <input class="form-control" type="file" placeholder="Choose File" name="nl_image" accept=".jpg, .jpeg, .png" required>
                        </div>
                    </div><!-- 
                    <div class="form-group row">
                        <label class="control-label col-md-3">Status</label>
                        <div class="col-md-8">
                            <select class="form-control col-md-15" name="category_id">
                                <option selected>-------None-------</option>
                                <option value='Pending'></option>";
                                ?>
                            </select>
                            <input class="form-control" type="password" placeholder="Enter password" name="admin_password" pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}" title="Must contain at least one number, one uppercase and lowercase letter, one special character, and at least 8 or more characters" required>
                        </div>
                    </div> -->

            </div>
            <div class="tile-footer">
                <div class="row">
                    <div class="col-md-8 col-md-offset-3">
                        <input type="submit" value="Submit" name="submit" class="btn btn-primary" style="background-color: #164d19;border:2px solid #164d19">&nbsp;&nbsp;&nbsp;<input type="reset" name="reset" value="Cancel" class="btn btn-secondary" href="#">
                    </div>
                </div>
            </div>
            </form>
        </div>
    </div>
    </div>
</main>
<!-- Essential javascripts for application to work-->
<script src="js/jquery-3.3.1.min.js"></script>
<script src="js/popper.min.js"></script>
<script src="js/bootstrap.min.js"></script>
<script src="js/main.js"></script>
<!-- The javascript plugin to display page loading on top-->
<script src="js/plugins/pace.min.js"></script>
<!-- Page specific javascripts-->
<?php
include "script.php";
?>
</body>

</html>
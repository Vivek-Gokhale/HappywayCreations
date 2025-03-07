<?php
session_start();
include "header.php";
?>
<!-- Sidebar menu-->
<?php
include 'aside.php';
?>
<main class="app-content">
    <div class="app-title">
        <div>
            <h1><i class="fa fa-edit"></i>Delivery Partner</h1>
        </div>
        <ul class="app-breadcrumb breadcrumb">
            <li class="breadcrumb-item"><i class="fa fa-home fa-lg"></i></li>
            <li class="breadcrumb-item">Forms</li>
            <li class="breadcrumb-item"><a href="#">Delivery Partner</a></li>
        </ul>
    </div>
    <div class="col-md-6" style="text-align:left;">
        <div class="tile">
            <h3 class="tile-title">Delivery Partner Details</h3>
            <div class="tile-body">
                <form class="form-horizontal" method="post" enctype="multipart/form-data" action="deli-partner-form-process.php">
                    <div class="form-group row">
                        <label class="control-label col-md-3">Name</label>
                        <div class="col-md-8">
                            <input class="form-control" type="text" placeholder="Enter your name" name="dp_name" required>
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="control-label col-md-3">E-mail</label>
                        <div class="col-md-8">
                            <input class="form-control" type="email" placeholder="Enter your email" name="dp_email" required>
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="control-label col-md-3">Contact No.</label>
                        <div class="col-md-8">
                            <input class="form-control" type="number" title="Must be of length 10" placeholder="Enter your contact no" name="dp_contact_no" required>
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="control-label col-md-3">Address</label>
                        <div class="col-md-8">
                            <textarea class="form-control" placeholder="Address" rows="5" cols="40" name="dp_address"></textarea>
                            <!-- <input class="form-control" type="text" placeholder="Enter your address" name="dp_address" required> -->
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="control-label col-md-3">Identity Proof (.jpg format)</label>
                        <div class="col-md-8">
                            <input class="form-control" type="file" placeholder="Choose File" name="identity_proof" accept=".jpg, .jpeg, .png" required>
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="control-label col-md-3">Password</label>
                        <div class="col-md-8">
                            <input class="form-control" type="password" placeholder="Enter password" name="dp_password" pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}" title="Must contain at least one number, one uppercase and lowercase letter, one special character, and at least 8 or more characters" required>
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="control-label col-md-3">Confirm Password</label>
                        <div class="col-md-8">
                            <input class="form-control" type="password" placeholder="Retype password" name="dp_confirm_password" pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}" title="Must contain at least one number, one uppercase and lowercase letter, one special character, and at least 8 or more characters" required>
                        </div>
                    </div>

            </div>
            <div class="tile-footer">
                <div class="row">
                    <div class="col-md-8 col-md-offset-3">
                        <input type="submit" value="Submit" name="submit11" class="btn btn-primary" style="background-color: #164d19;border:2px solid #164d19">&nbsp;&nbsp;&nbsp;<input type="reset" name="reset" value="Cancel" class="btn btn-secondary" href="#">
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
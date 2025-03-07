<?php
session_start();
include "header.php";
?>
<!-- Sidebar menu-->
<?php
include 'aside.php';
?>
<?php
include 'connection.php';
$id = $_GET['id'];
$sql = "select * from newsletter where nl_id='$id'";
$result = mysqli_query($conn, $sql);
$row = mysqli_fetch_array($result);
$id = $row['nl_id'];
$subject = $row['nl_subject'];
$content = $row['nl_content'];
$image = $row['nl_image'];
$status = $row['status'];
?>
<!-- update -->
<?php
/* if ($_POST) {
    $id = $_POST['product_id'];
    $name = $_POST['product_name'];
    $description = mysqli_real_escape_string($conn, $_POST['product_description']);
    $catid = $_POST['category_id'];
    $mrp = $_POST['product_mrp'];
    $discount = $_POST['product_discount'];
    $avail = $_POST['no_of_items'];
    $color = $_POST['product_color'];
    $image = $_FILES['product_image']['name'];
    $path = $_FILES['product_image']['tmp_name'];
    $sql = "update product set product_name='$name', category_id= '$catid',product_mrp ='$mrp',product_discount='$discount',product_description='$description',no_of_items='$avail',product_color='$color',product_image='$image'  where product_id='$id'";
    $result = mysqli_query($conn, $sql);
    if ($result) {
        move_uploaded_file($path, "product-uploads/" . $image);
        echo "<script>alert('Record Update');window.location = 'product-table.php';</script>";
    } else {
        echo "<script>alert('Record Not Updated')</script>";
    }
} */

?>
<main class="app-content">
    <div class="app-title">
        <div>
            <h1><i class="fa fa-edit"></i>Newsletter Form</h1>
        </div>
        <ul class="app-breadcrumb breadcrumb">
            <li class="breadcrumb-item"><i class="fa fa-home fa-lg"></i></li>
            <li class="breadcrumb-item">Forms</li>
            <li class="breadcrumb-item"><a href="#">Newsletter Form</a></li>
        </ul>
    </div>
    <div class="col-md-6" style="text-align:left;">
        <div class="tile">
            <h3 class="tile-title">Newsletter Details</h3>
            <div class="tile-body">
                <form class="form-horizontal" method="post" enctype="multipart/form-data">
                    <div class="form-group row">
                        <label class="control-label col-md-3">ID</label>
                        <div class="col-md-8">
                            <input class="form-control" type="text" placeholder="Enter product's name" name="product_name" value="<?php echo $id ?>" readonly>
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="control-label col-md-3">Subject</label>
                        <div class="col-md-8">
                            <textarea class="form-control" placeholder="Product Desciption" rows="5" cols="40" name="product_description"><?php echo $subject ?></textarea>
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="control-label col-md-3">Content</label>
                        <div class="col-md-8">
                            <textarea class="form-control" placeholder="Product Desciption" rows="9" cols="40" name="product_description"><?php echo $content ?></textarea>
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="control-label col-md-3">Status</label>
                        <div class="col-md-8">
                            <select class="form-control col-md-15" name="category_id" readonly>
                                <option selected value="<?php echo $status ?>"><?php echo $status ?></option><!-- 
                                    <option value="Pending">Pending</option>
                                    <option value="Sent">Sent</option> -->
                            </select>
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="control-label col-md-3"> Current Image</label>
                        <?php if ($image) : ?>
                            <!-- <p><?php echo $image; ?></p> -->
                            <img src="../../admin-template/docs/newsletter-uploads/<?php echo $image; ?>" alt="Current Image" style="max-width: 150px;">
                        <?php else : ?>
                            <p>No image uploaded yet.</p>
                            <div class="col-md-8">
                                <!-- <input class="form-control" type="file" placeholder="Choose File" name="product_image" value="<?php echo $image ?>" required> -->
                            </div>
                    </div>

                <?php endif; ?><br>

            </div>
            <div class="tile-footer">
                <div class="row">
                    <div class="col-md-8 col-md-offset-3">
                        <input type="submit" value="Submit" name="submit11" class="btn btn-primary">&nbsp;&nbsp;&nbsp;<input type="reset" name="reset" value="Cancel" class="btn btn-secondary" href="#">
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
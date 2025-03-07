<?php
session_start();
include "header.php";
?>
<!-- Sidebar menu-->
<?php
include 'aside.php';
include 'connection.php';
if (isset($_POST["submit"])) {
    $name = $_POST['product_name'];
    $detail = mysqli_real_escape_string($conn, $_POST['product_description']);
    $cat = $_POST['category_id'];
    $mrp = $_POST['product_mrp'];
    $discount = $_POST['product_discount'];
    $brand = $_POST['product_brand'];
    $avail = $_POST['no_of_items'];
    $color = $_POST['product_color'];
    $tax = $_POST['product_tax'];
    $featured = $_POST['is_featured'];

    $totalfiles = count($_FILES['product_image']['name']);
    $filesArray = array();

    for ($i = 0; $i < $totalfiles; $i++) {
        $imageName = $_FILES['product_image']['name'][$i];
        $path = $_FILES['product_image']['tmp_name'][$i];
        $imageExtension = explode('.', $imageName);
        $imageExtension = strtolower(end($imageExtension));
        $newImageName = uniqid() . '.' . $imageExtension;
        //echo "<script>alert('Image Uploaded');</script>";
        move_uploaded_file($path, "../../admin-template/docs/product-uploads/" . $newImageName);
        $filesArray[] = $newImageName;
    }

    $images = json_encode($filesArray);
    $sql = "insert into product (product_name,product_description,product_brand,category_id,product_mrp,product_discount,no_of_items,product_color,product_image,tax,isFeatured) values('$name','$detail','$brand','$cat','$mrp','$discount','$avail','$color','$images','$tax','$featured')";

    if (mysqli_query($conn, $sql)) {
        echo "<script>window.location='product-table.php';</script>";
    } else {
        echo "Problem" . mysqli_error($conn);
    }
}
?>
<main class="app-content">
    <div class="app-title">
        <div>
            <h1><i class="fa fa-edit"></i>Product Form</h1>
        </div>
        <ul class="app-breadcrumb breadcrumb">
            <li class="breadcrumb-item"><i class="fa fa-home fa-lg"></i></li>
            <li class="breadcrumb-item">Forms</li>
            <li class="breadcrumb-item"><a href="#">Products Form</a></li>
        </ul>
    </div>
    <div class="col-md-6" style="text-align:left;">
        <div class="tile">
            <h3 class="tile-title">Product Details</h3>
            <div class="tile-body">
                <form class="form-horizontal" method="post" enctype="multipart/form-data">
                    <div class="form-group row">
                        <label class="control-label col-md-3">Name</label>
                        <div class="col-md-8">
                            <input class="form-control" type="text" placeholder="Enter product's name" name="product_name" required>
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="control-label col-md-3">Description</label>
                        <div class="col-md-8">
                            <textarea class="form-control" placeholder="Product Desciption" rows="5" cols="40" name="product_description"></textarea>
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="control-label col-md-3">Brand</label>
                        <div class="col-md-8">
                            <input class="form-control" type="text" placeholder="Enter product's brand" name="product_brand" required>
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="control-label col-md-3">Product Category</label>
                        <div class="col-md-8">
                            <!--<input class="form-control" type="text" placeholder="Enter category" name="item_category">-->
                            <select class="form-control col-md-15" name="category_id">
                                <option value="" disabled selected>-------None-------</option>
                                <?php
                                include 'connection.php';
                                $q = mysqli_query($conn, "select * from category");
                                while ($row = mysqli_fetch_array($q)) {
                                    //echo "<option value=".$row['sector_id'].">". $row['sector_name']." </option>";
                                    echo "<option value='{$row['category_id']}'> {$row['category_name']} </option>";
                                }
                                ?>
                            </select>
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="control-label col-md-3">Product MRP</label>
                        <div class="col-md-8">
                            <input class="form-control" type="number" placeholder="Enter MRP of Product" name="product_mrp" step="any" required>
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="control-label col-md-3">Discount (in percentage)</label>
                        <div class="col-md-8">
                            <input class="form-control" type="number" placeholder="Enter discount (if any)" name="product_discount">
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="control-label col-md-3">Availabilty of Product</label>
                        <div class="col-md-8">
                            <input class="form-control" type="number" placeholder="Enter no. of available product" name="no_of_items" required>
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="control-label col-md-3">Color</label>
                        <div class="col-md-8">
                            <!-- <input class="form-control" type="text" placeholder="Enter product's color" name="product_color" required> -->
                            <select class="form-control col-md-15" name="product_color">
                                <option value="" disabled selected>-------None-------</option>
                                <option value="Black">Black</option>
                                <option value="White">White</option>
                                <option value="Gray">Gray</option>
                                <option value="Red">Red</option>
                                <option value="Blue">Blue</option>
                                <option value="Green">Green</option>
                                <option value="Yellow">Yellow</option>
                                <option value="Orange">Orange</option>
                                <option value="Purple">Purple</option>
                                <option value="Pink">Pink</option>
                                <option value="Brown">Brown</option>
                                <option value="Beige">Beige</option>
                                <option value="Navy">Navy</option>
                                <option value="Teal">Teal</option>
                                <option value="Maroon">Maroon</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="control-label col-md-3">Product image (.jpg format)</label>
                        <div class="col-md-8">
                            <input class="form-control" type="file" placeholder="Choose File" name="product_image[]" accept=".jpg, .jpeg, .png" required multiple>
                        </div>
                    </div>

                    <div class="form-group row">
                        <label class="control-label col-md-3">Tax on Product</label>
                        <div class="col-md-8">
                            <input class="form-control" type="number" placeholder="Enter tax" name="product_tax">
                        </div>
                    </div>


                    <div class="form-group row">
                        <label class="control-label col-md-3">Featured</label>
                        <div class="col-md-8">
                            <select class="form-control col-md-15" name="is_featured">
                                <option value="" disabled selected>-------None-------</option>
                                <option value="1">Yes</option>
                                <option value="0">No</option>
                            </select>
                        </div>
                    </div>

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
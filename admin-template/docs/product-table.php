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
if (isset($_GET['did'])) {
    $id = $_GET['did'];
    $did = mysqli_query($conn, "delete from product where product_id ='{$id}'");
    if ($did) {
        echo "<script>alert('Record Deleted');window.location='product-table.php';</script>";
    } else {
        echo "<script>alert('Record Not Deleted');window.location='product-table.php';</script>";
    }
}

//Category Search
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $category_id = isset($_POST['sr_category']) ? $_POST['sr_category'] : 0;
    $brand = isset($_POST['brand']) ? $_POST['brand'] : '';

    // Initialize base query
    $q = "SELECT * FROM product";

    // Array to hold conditions
    $conditions = array();

    // Add conditions based on provided POST data
    if ($category_id != 0) {
        $conditions[] = "category_id = $category_id";
    }
    if (!empty($brand)) {
        $conditions[] = "product_brand = '$brand'";
    }

    // Append conditions to the query if any exist
    if (count($conditions) > 0) {
        $q .= " WHERE " . implode(" AND ", $conditions);
    }

    // Execute the query
    $r = mysqli_query($conn, $q);
    if (!$r) {
        echo "Error executing query: " . mysqli_error($conn);
    }
} else {
    $q = "SELECT * FROM product";
    $r = mysqli_query($conn, $q);
    if (!$r) {
        echo "Error executing query: " . mysqli_error($conn);
    }
}


$r = mysqli_query($conn, $q);
$i = 1;
?>
<main class="app-content">
    <div class="app-title">
        <div>
            <h1><i class="fa fa-th-list"></i> Product Table</h1>
        </div>
        <ul class="app-breadcrumb breadcrumb">
            <li class="breadcrumb-item"><i class="fa fa-home fa-lg"></i></li>
            <li class="breadcrumb-item">Tables</li>
            <li class="breadcrumb-item active"><a href="#">Product Table</a></li>
        </ul>
    </div>


    <div class="col-md-6" style="text-align:left;">
        <div class="tile">
            <h3 class="tile-title">Filter</h3>
            <div class="tile-body">
                <form class="form-horizontal" method="post" enctype="multipart/form-data" action="product-table.php">

                    <div class="form-group row">
                        <label class="control-label col-md-3">Category</label>
                        <div class="col-md-8">
                            <!--<input class="form-control" type="text" placeholder="Enter category" name="item_category">-->
                            <select class="form-control col-md-15" name="sr_category">
                                <option value="" disabled selected>-------None-------</option>
                                <option value="0">All</option>
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
                        <label class="control-label col-md-3">Brand</label>
                        <div class="col-md-8">
                            <!--<input class="form-control" type="text" placeholder="Enter category" name="item_category">-->
                            <select class="form-control col-md-15" name="brand">
                                <option value="" disabled selected>-------None-------</option>
                                <!-- <option value="0">All</option> -->
                                <?php
                                include 'connection.php';
                                $dq = mysqli_query($conn, "select DISTINCT product_brand from product");
                                while ($row = mysqli_fetch_array($dq)) {
                                    //echo "<option value=".$row['sector_id'].">". $row['sector_name']." </option>";
                                    echo "<option value='{$row['product_brand']}'> {$row['product_brand']} </option>";
                                }
                                ?>
                            </select>
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


    <div class="col-md-12">
        <div class="tile">
            <h3 class="tile-title">Product Table</h3>
            <table class="table table-hover">
                <thead>
                    <tr>
                        <th>SR. No.</th>
                        <th>Product Name</th>
                        <th>Product Desciption</th>
                        <th>Product Brand</th>
                        <th>Product Category ID</th>
                        <th>Product MRP</th>
                        <th>Product Discount</th>
                        <th>Product Availabilty</th>
                        <th>Product Color</th>
                        <th style="width: 30px;">Product Image</th>
                        <th>Applicable Tax</th>
                        <th>Featured Product</th>
                        <th>Action</th>
                    </tr>

                </thead>
                <tbody>

                    <?php


                    while ($row = mysqli_fetch_array($r)) {
                        echo "<tr>";
                        echo "<td>" . $i . "</td>";
                        echo "<td>" . $row['product_name'] . "</td>";
                        echo "<td>" . $row['product_description'] . "</td>";
                        echo "<td>" . $row['product_brand'] . "</td>";
                        echo "<td>" . $row['category_id'] . "</td>";
                        echo "<td>" . $row['product_mrp'] . "</td>";
                        echo "<td>" . $row['product_discount'] . "</td>";
                        echo "<td>" . $row['no_of_items'] . "</td>";
                        echo "<td>" . $row['product_color'] . "</td>";
                    ?>
                        <td style="word-wrap: break-word;word-break: break-all;white-space: normal;"><?php $row['product_image'] ?></td>
                    <?php
                        echo "<td>" . $row['tax'] . "</td>";
                        echo "<td>" . $row['isFeatured'] . "</td>";
                        echo "<td><a href='product-edit.php?pid={$row['product_id']}'>Edit</a> | <a href='product-table-process.php?did={$row['product_id']}'>Delete</a> </td>";
                        //echo "<td><a href='product-table-process.php?did={$row['product_id']}'>Delete</a> </td>";
                        echo "</tr>";
                        $i++;
                    } ?>
                </tbody>
            </table>
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
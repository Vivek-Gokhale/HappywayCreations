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
    $did = mysqli_query($conn, "delete from product_review where product_review_id 	 ='{$id}'");
    if ($did) {
        echo "<script>alert('Record Deleted');window.location='product-review-table.php';</script>";
    } else {
        echo "<script>alert('Record Not Deleted');window.location='product-review-table.php';</script>";
    }
}
?>
<main class="app-content">
    <div class="app-title">
        <div>
            <h1><i class="fa fa-th-list"></i> Product Review Table</h1>
        </div>
        <ul class="app-breadcrumb breadcrumb">
            <li class="breadcrumb-item"><i class="fa fa-home fa-lg"></i></li>
            <li class="breadcrumb-item">Tables</li>
            <li class="breadcrumb-item active"><a href="#"> Product Review Table</a></li>
        </ul>
    </div>
    <div class="col-md-12">
        <div class="tile">
            <h3 class="tile-title"> Product Review Table</h3>
            <table class="table table-hover">
                <thead>
                    <tr>
                        <th>SR. No.</th>
                        <th>Product Id</th>
                        <th>Product Rating</th>
                        <th>Product Feedback</th>
                        <th>Product Review Image</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    <?php
                    $q = "select * from product_review";
                    $r = mysqli_query($conn, $q);
                    $i = 1;
                    while ($row = mysqli_fetch_array($r)) {
                        echo "<tr>";
                        echo "<td>" . $i . "</td>";
                        echo "<td>" . $row['product_id'] . "</td>";
                        echo "<td>" . $row['product_rating'] . "</td>";
                        echo "<td>" . $row['product_feedback'] . "</td>";
                        echo "<td>" . $row['product_review_image'] . "</td>";
                        //echo "<td><a href='product-edit.php?pid={$row['product_id']}'>Edit</a> | <a href='product-table-process.php?did={$row['product_id']}'>Delete</a> </td>";
                        echo "<td><a href='product-review-table-process.php?did={$row['product_review_id']}'>Delete</a> </td>";
                        echo "</tr>";
                        $i++;
                    }
                    ?>
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
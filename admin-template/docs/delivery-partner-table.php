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
    $did = mysqli_query($conn, "delete from delivery_partner where delivery_partner_id ='{$id}'");
    if ($did) {
        echo "<script>alert('Record Deleted');window.location=deli-partner-table.php';</script>";
    } else {
        echo "<script>alert('Record Not Deleted');window.location='deli-partner-table.php';</script>";
    }
}
?>
<main class="app-content">
    <div class="app-title">
        <div>
            <h1><i class="fa fa-th-list"></i> Delivery Partner Table</h1>
        </div>
        <ul class="app-breadcrumb breadcrumb">
            <li class="breadcrumb-item"><i class="fa fa-home fa-lg"></i></li>
            <li class="breadcrumb-item">Tables</li>
            <li class="breadcrumb-item active"><a href="#">Delivery Partner Table</a></li>
        </ul>
    </div>
    <div class="col-md-12">
        <div class="tile">
            <h3 class="tile-title">Delivery Partner Table</h3>
            <table class="table table-hover">
                <thead>
                    <tr>
                        <th>SR. No.</th>
                        <th>Contact No.</th>
                        <th>Name</th>
                        <th>E-mail</th>
                        <th>Address</th>
                        <th>Identity Proof</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    <?php
                    $q = "select * from delivery_partner";
                    $r = mysqli_query($conn, $q);
                    $i = 1;
                    while ($row = mysqli_fetch_array($r)) {
                        echo "<tr>";
                        echo "<td>" . $i . "</td>";
                        echo "<td>" . $row['dp_contact_no'] . "</td>";
                        echo "<td>" . $row['dp_name'] . "</td>";
                        echo "<td>" . $row['dp_email'] . "</td>";
                        echo "<td>" . $row['dp_address'] . "</td>";
                        echo "<td>" . $row['identity_proof'] . "</td>";
                        //echo "<td><a href='product-edit.php?pid={$row['product_id']}'>Edit</a> | <a href='product-table-process.php?did={$row['product_id']}'>Delete</a> </td>";
                        echo "<td><a href='deli-partner-edit.php?uid={$row['delivery_partner_id']}'>Edit</a> | <a href='deli-partner-table.php?did={$row['delivery_partner_id']}'>Delete</a> </td>";
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
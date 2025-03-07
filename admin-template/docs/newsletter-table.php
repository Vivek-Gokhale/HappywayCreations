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
    $did = mysqli_query($conn, "delete from newsletter where nl_id  ='{$id}'");
    if ($did) {
        echo "<script>alert('Record Deleted');window.location='newsletter-table.php';</script>";
    } else {
        echo "<script>alert('Record Not Deleted');window.location='newsletter-table.php';</script>";
    }
}
?>
<main class="app-content">
    <div class="app-title">
        <div>
            <h1><i class="fa fa-th-list"></i> Newsletter Table</h1>
        </div>
        <ul class="app-breadcrumb breadcrumb">
            <li class="breadcrumb-item"><i class="fa fa-home fa-lg"></i></li>
            <li class="breadcrumb-item">Tables</li>
            <li class="breadcrumb-item active"><a href="#">Newsletter Table</a></li>
        </ul>
    </div>
    <div class="col-md-12">
        <div class="tile">
            <h3 class="tile-title">Newsletter Table</h3>
            <table class="table table-hover">
                <thead>
                    <tr>
                        <th>SR. No.</th>
                        <th>Subject</th>
                        <th>Content</th>
                        <th>Image</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                    <?php
                    $q = "select * from newsletter";
                    $r = mysqli_query($conn, $q);
                    $i = 1;
                    while ($row = mysqli_fetch_array($r)) {
                        echo "<tr>";
                        echo "<td>" . $i . "</td>";
                        echo "<td>" . $row['nl_subject'] . "</td>";
                        echo "<td>" . htmlspecialchars($row['nl_content'], ENT_QUOTES, 'UTF-8') . "</td>";
                        echo "<td>" . $row['nl_image'] . "</td>";
                        echo "<td>" . $row['status'] . "</td>";
                        if ($row['status'] == 'Sent') {
                            echo "<td><a href='newsletter-table.php?did={$row['nl_id']}'>Delete</a> | <a href='newsletter-email-process.php?id={$row['nl_id']}'>Resend</a> ";
                            echo "| <a href='newsletter-edit.php?id={$row['nl_id']}'>Edit</a> </td>";
                        } else {
                            echo "<td><a href='newsletter-table.php?did={$row['nl_id']}'>Delete</a> | <a href='newsletter-email-process.php?id={$row['nl_id']}'>Send</a> ";
                            echo "| <a href='newsletter-edit.php?id={$row['nl_id']}'>Edit</a> </td>";
                        }

                        echo "</tr>";
                        $i++;
                    }
                    ?>
                </thead>
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
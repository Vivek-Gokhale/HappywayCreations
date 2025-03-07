<?php
session_start();
include "header.php";
include 'aside.php';
include 'connection.php';
?>

<main class="app-content">
    <div class="app-title">
        <div>
            <h1><i class="fa fa-th-list"></i> Orders Table</h1>
        </div>
        <ul class="app-breadcrumb breadcrumb">
            <li class="breadcrumb-item"><i class="fa fa-home fa-lg"></i></li>
            <li class="breadcrumb-item">Tables</li>
            <li class="breadcrumb-item active"><a href="#"> Orders Table</a></li>
        </ul>
    </div>
    <div class="col-md-12">
        <div class="tile">
            <h3 class="tile-title"> Orders Table</h3>
            <div class="table-responsive">
                <table class="table table-hover">
                    <thead>
                        <tr>
                            <th>SR. No.</th>
                            <th>User ID</th>
                            <th>Products</th>
                            <th>Products Qty</th>
                            <th>Order Date</th>
                            <th>Order Option</th>
                            <th>Total Amount</th>
                            <th>Coupon Code</th>
                            <th>Time Stamp</th>
                            <th>Delivery Status</th>
                            <th>Assigned Partner Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php
                        $limit = 10; // Number of entries per page
                        $page = isset($_GET['page']) ? $_GET['page'] : 1;
                        $offset = ($page - 1) * $limit;
                        
                        $q = "SELECT * FROM orders LIMIT $limit OFFSET $offset";
                        $r = mysqli_query($conn, $q);
                        $i = $offset + 1;
                        $currentTime = new DateTime();
                        
                        while ($row = mysqli_fetch_array($r)) {
                            echo "<tr>";
                            echo "<td>" . $i . "</td>";
                            echo "<td>" . $row['user_id'] . "</td>";
                            echo "<td>" . htmlspecialchars($row['product_ids']) . "</td>";
                            echo "<td>" . htmlspecialchars($row['product_qtys']) . "</td>";
                            echo "<td>" . $row['order_date'] . "</td>";
                            echo "<td>" . $row['payment_option'] . "</td>";
                            echo "<td>" . number_format($row['total_amount'], 2) . "</td>";
                            echo "<td>" . htmlspecialchars($row['coupon_code']) . "</td>";
                            echo "<td>" . $row['order_date'] . "</td>";
                            echo "<td>" . $row['delivery_status'] . "</td>";
                            echo "<td>" . (!empty($row['assigned_partner_name']) ? $row['assigned_partner_name'] : "Not Assigned") . "</td>";
                            echo "</tr>";
                            $i++;
                        }
                        ?>
                    </tbody>
                </table>
            </div>
            <!-- Pagination -->
            <nav>
                <ul class="pagination">
                    <?php
                    $count_query = "SELECT COUNT(*) AS total FROM orders";
                    $count_result = mysqli_query($conn, $count_query);
                    $count_row = mysqli_fetch_assoc($count_result);
                    $total_pages = ceil($count_row['total'] / $limit);
                    
                    for ($p = 1; $p <= $total_pages; $p++) {
                        echo "<li class='page-item" . ($p == $page ? " active" : "") . "'><a class='page-link' href='?page=$p'>$p</a></li>";
                    }
                    ?>
                </ul>
            </nav>
        </div>
    </div>
</main>

<script src="js/jquery-3.3.1.min.js"></script>
<script src="js/popper.min.js"></script>
<script src="js/bootstrap.min.js"></script>
<script src="js/main.js"></script>
<script src="js/plugins/pace.min.js"></script>
<?php include "script.php"; ?>
</body>
</html>
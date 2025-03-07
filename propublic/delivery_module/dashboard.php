<?php
session_start();
if (!isset($_SESSION['delivery_partner_id'])) {
    header('Location: index.php');
    exit();
}
include 'db_connection.php';
$partner_id = $_SESSION['delivery_partner_id'];

// Fetch available orders
$orders_result = $conn->query('SELECT * FROM orders WHERE delivery_status = "Pending"');

// Fetch orders assigned to the logged-in delivery partner
$my_orders_result = $conn->query("SELECT 
    delivery_order.order_id, delivery_order.status ,
    orders.order_id, orders.user_id, orders.order_date, orders.total_amount, orders.delivery_status ,orders.payment_option ,
    user_register_details.user_id,user_register_details.first_name,
    user_addresses.*
FROM 
    delivery_order
INNER JOIN 
    orders ON delivery_order.order_id = orders.order_id
INNER JOIN 
    user_register_details ON orders.user_id = user_register_details.user_id
INNER JOIN 
    user_addresses ON user_register_details.user_id = user_addresses.user_id
WHERE 
    delivery_order.delivery_partner_id = $partner_id and delivery_order.status = 'Accepted'");




$my_orders_com_result = $conn->query("SELECT 
    delivery_order.order_id, delivery_order.status ,
    orders.order_id, orders.user_id, orders.order_date, orders.total_amount, orders.delivery_status ,orders.payment_option ,
    user_register_details.user_id,user_register_details.first_name,
    user_addresses.*
FROM 
    delivery_order
INNER JOIN 
    orders ON delivery_order.order_id = orders.order_id
INNER JOIN 
    user_register_details ON orders.user_id = user_register_details.user_id
INNER JOIN 
    user_addresses ON user_register_details.user_id = user_addresses.user_id
WHERE 
    delivery_order.delivery_partner_id = $partner_id and delivery_order.status = 'Completed'");
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Delivery Partner Dashboard</title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
    <link rel="stylesheet" href="styles.css">
</head>

<body>
    <div class="container">
        <div class="d-flex justify-content-between align-items-center mt-5">
            <h1>Welcome, Delivery Partner</h1>
            <a href="change-password.php" class="btn btn-danger">Change Password</a>
            <a href="logout.php" class="btn btn-danger">Logout</a>
        </div>
        <div class="card">
            <div class="card-header" style="background-color: darkgreen; color: white;"> Available Orders</div>

            <div class="card-body">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>User ID</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php while ($order = $orders_result->fetch_assoc()) : ?>
                            <tr>
                                <td><?php echo $order['order_id']; ?></td>
                                <td><?php echo $order['user_id']; ?></td>
                                <td>
                                    <!-- <button class="btn btn-success accept-order" data-order-id="<?php echo $order['order_id']; ?>">Accept</button> -->
                                    <?php
                                    echo "<a href='update_order_status.php?oid={$order['order_id']}'>Accept</a>";
                                    ?>
                                </td>
                            </tr>
                        <?php endwhile; ?>
                    </tbody>
                </table>
            </div>
        </div>


        <div class="card">
            <div class="card-header" style="background-color: darkgreen; color: white;">My Pending Orders</div>
            <div class="card-body">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>User ID</th>
                            <th>Name</th>
                            <th>Phone No.</th>
                            <th>Address</th>
                            <th>Total Amount</th>
                            <th>Payment Option</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php while ($order = $my_orders_result->fetch_assoc()) : ?>
                            <?php if ($order['status'] == 'Accepted') { ?>
                                <tr>
                                    <td><?php echo $order['order_id']; ?></td>
                                    <td><?php echo $order['user_id']; ?></td>
                                    <td><?php echo $order['name']; ?></td>
                                    <td><?php echo $order['phone_no']; ?></td>
                                    <td><?php

                                        $house_apartment = $order['house_apartment'];
                                        $area = $order['area'];
                                        $landmark = $order['landmark'];
                                        $town_city = $order['town_city'];
                                        $state = $order['state'];
                                        $pincode = $order['pincode'];
                                        $default = $order['is_default'];

                                        $addr = $house_apartment . ',' . $area . ',' . $landmark . ',' . $town_city . ',' . $state . '-' . $pincode;

                                        if ($default == 1) {
                                            echo $addr;
                                        } ?></td>
                                    <td><?php echo $order['total_amount']; ?></td>
                                    <td><?php echo $order['payment_option']; ?></td>
                                    <td><?php echo $order['status']; ?></td>
                                    <td>
                                        <?php if ($order['status'] == 'Accepted') : ?>
                                            <!-- <button class="btn btn-primary complete-order" data-order-id="<?php echo $order['order_id']; ?>">Complete</button> -->

                                            <?php
                                            echo "<a href='update_order_status_1.php?oid={$order['order_id']}'>Completed</a>";
                                            ?>

                                        <?php elseif ($order['status'] == 'completed') : ?>
                                            <span class="badge badge-success">Completed</span>
                                        <?php endif; ?>
                                    </td>
                                </tr>
                        <?php }
                        endwhile; ?>
                    </tbody>
                </table>
            </div>
        </div>


        <div class="card">
            <div class="card-header" style="background-color: darkgreen; color: white;">My Completed Orders</div>
            <div class="card-body">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>User ID</th>
                            <th>Name</th>
                            <th>Phone No.</th>
                            <th>Address</th>
                            <th>Total Amount</th>
                            <th>Payment Option</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php while ($order = $my_orders_com_result->fetch_assoc()) : ?>
                            <tr>
                                <td><?php echo $order['order_id']; ?></td>
                                <td><?php echo $order['user_id']; ?></td>
                                <td><?php echo $order['name']; ?></td>
                                <td><?php echo $order['phone_no']; ?></td>
                                <td><?php

                                    $house_apartment = $order['house_apartment'];
                                    $area = $order['area'];
                                    $landmark = $order['landmark'];
                                    $town_city = $order['town_city'];
                                    $state = $order['state'];
                                    $pincode = $order['pincode'];
                                    $default = $order['is_default'];

                                    $addr = $house_apartment . ',' . $area . ',' . $landmark . ',' . $town_city . ',' . $state . '-' . $pincode;

                                    if ($default == 1) {
                                        echo $addr;
                                    } ?></td>
                                <td><?php echo $order['total_amount']; ?></td>
                                <td><?php echo $order['payment_option']; ?></td>
                                <td><?php echo $order['status']; ?></td>

                            </tr>
                        <?php
                        endwhile; ?>
                    </tbody>
                </table>
            </div>
        </div>



    </div>
    <script src="script.js"></script>
</body>

</html>
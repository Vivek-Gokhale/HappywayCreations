<?php
session_start();

// Redirect to login if the delivery partner is not logged in
if (!isset($_SESSION['delivery_partner_id'])) {
    header('Location: index.php');
    exit();
}

include 'db_connection.php';
$partner_id = $_SESSION['delivery_partner_id'];

// Fetch the logged-in delivery partner's name
$partner_result = $conn->query("SELECT dp_name FROM delivery_partner WHERE delivery_partner_id = $partner_id");
$partner_data = $partner_result->fetch_assoc();
$partner_name = $partner_data['dp_name'];

// Fetch available orders (not yet assigned)
$orders_result = $conn->query('SELECT * FROM orders WHERE delivery_status = "Pending"');

// Fetch orders assigned to the logged-in delivery partner (Accepted)
$my_orders_result = $conn->query("
    SELECT 
        delivery_order.order_id, delivery_order.status,
        orders.order_id, orders.user_id, orders.order_date, orders.total_amount, orders.delivery_status, 
        orders.payment_option, orders.assigned_partner_name,
        user_register_details.first_name, user_addresses.*
    FROM 
        delivery_order
    INNER JOIN 
        orders ON delivery_order.order_id = orders.order_id
    INNER JOIN 
        user_register_details ON orders.user_id = user_register_details.user_id
    INNER JOIN 
        user_addresses ON user_register_details.user_id = user_addresses.user_id
    WHERE 
        delivery_order.delivery_partner_id = $partner_id AND delivery_order.status = 'Accepted'
");

// Fetch completed orders for the logged-in delivery partner
$my_orders_com_result = $conn->query("
    SELECT 
        delivery_order.order_id, delivery_order.status,
        orders.order_id, orders.user_id, orders.order_date, orders.total_amount, orders.delivery_status, 
        orders.payment_option, orders.assigned_partner_name,
        user_register_details.first_name, user_addresses.*
    FROM 
        delivery_order
    INNER JOIN 
        orders ON delivery_order.order_id = orders.order_id
    INNER JOIN 
        user_register_details ON orders.user_id = user_register_details.user_id
    INNER JOIN 
        user_addresses ON user_register_details.user_id = user_addresses.user_id
    WHERE 
        delivery_order.delivery_partner_id = $partner_id AND delivery_order.status = 'Completed'
");
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Delivery Partner Dashboard</title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
</head>

<body>
    <div class="container">
        <div class="d-flex justify-content-between align-items-center mt-5">
            <h1>Welcome, <?php echo htmlspecialchars($partner_name); ?></h1>
            <div>
                <a href="change-password.php" class="btn btn-warning">Change Password</a>
                <a href="logout.php" class="btn btn-danger">Logout</a>
            </div>
        </div>

        <!-- Available Orders -->
        <div class="card mt-4">
            <div class="card-header" style="background-color: darkgreen; color: white;">Available Orders</div>
            <div class="card-body">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>User ID</th>
                            <th>Assigned Partner Name</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php while ($order = $orders_result->fetch_assoc()) : ?>
                            <tr>
                                <td><?php echo $order['order_id']; ?></td>
                                <td><?php echo $order['user_id']; ?></td>
                                <td><?php echo $order['assigned_partner_name'] ?? 'Not Assigned'; ?></td>
                                <td>
                                    <a href="update_order_status.php?oid=<?php echo $order['order_id']; ?>">Accept</a>
                                </td>
                            </tr>
                        <?php endwhile; ?>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- My Pending Orders -->
        <div class="card mt-4">
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
                            <tr>
                                <td><?php echo $order['order_id']; ?></td>
                                <td><?php echo $order['user_id']; ?></td>
                                <td><?php echo $order['first_name']; ?></td>
                                <td><?php echo $order['phone_no']; ?></td>
                                <td><?php echo $order['house_apartment'] . ', ' . $order['area'] . ', ' . $order['landmark'] . ', ' . $order['town_city'] . ', ' . $order['state'] . ' - ' . $order['pincode']; ?></td>
                                <td><?php echo number_format($order['total_amount'], 2); ?></td>
                                <td><?php echo $order['payment_option']; ?></td>
                                <td><?php echo $order['status']; ?></td>
                                <td>
                                    <a href="update_order_status_1.php?oid=<?php echo $order['order_id']; ?>">Mark as Completed</a>
                                </td>
                            </tr>
                        <?php endwhile; ?>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- My Completed Orders -->
        <div class="card mt-4">
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
                                <td><?php echo $order['first_name']; ?></td>
                                <td><?php echo $order['phone_no']; ?></td>
                                <td><?php echo $order['house_apartment'] . ', ' . $order['area'] . ', ' . $order['landmark'] . ', ' . $order['town_city'] . ', ' . $order['state'] . ' - ' . $order['pincode']; ?></td>
                                <td><?php echo number_format($order['total_amount'], 2); ?></td>
                                <td><?php echo $order['payment_option']; ?></td>
                                <td><?php echo $order['status']; ?></td>
                            </tr>
                        <?php endwhile; ?>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</body>

</html>

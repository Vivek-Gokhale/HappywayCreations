
<?php
include 'connection.php';

if (isset($_GET['did'])) {
    $id = $_GET['did'];
    $did = mysqli_query($conn, "delete from cart_products where cart_products_id ='{$id}'");
    if ($did) {
        echo "<script>alert('Record Deleted');window.location='cart-products-table.php';</script>";
    } else {
        echo "<script>alert('Record Not Deleted');window.location='cart-products-table.php';</script>";
    }
}
$q = "select * from cart_products";
$r = mysqli_query($conn, $q);
$i = 1;
while ($row = mysqli_fetch_array($r)) {
    echo "<tr>";
    echo "<td>" . $i . "</td>";
    echo "<td>" . $row['cart_id'] . "</td>";
    echo "<td>" . $row['product_id'] . "</td>";
    echo "<td>" . $row['product_qty'] . "</td>";
    //echo "<td><a href='product-edit.php?pid={$row['product_id']}'>Edit</a> | <a href='product-table-process.php?did={$row['product_id']}'>Delete</a> </td>";
    echo "<td><a href='cart-products-table-process.php?did={$row['cart_products_id']}'>Delete</a> </td>";
    echo "</tr>";
    $i++;
}
?>
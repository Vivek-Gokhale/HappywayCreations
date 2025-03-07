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
  $ngoid=$_SESSION['ngo_id'];
  if(isset($_GET['did']))
  {
    $id = $_GET['did'];
    $did = mysqli_query($conn,"delete from tbl_item where item_id ='{$id}'");
    if($did)
    {
      echo "<script>alert('Record Deleted');</script>";
    }
    else
    {
      echo "<script>alert('Record Not Deleted');</script>";
    }
  }
?>
    <main class="app-content">
      <div class="app-title">
        <div>
          <h1><i class="fa fa-th-list"></i> Item Table</h1>
        </div>
        <ul class="app-breadcrumb breadcrumb">
          <li class="breadcrumb-item"><i class="fa fa-home fa-lg"></i></li>
          <li class="breadcrumb-item">Tables</li>
          <li class="breadcrumb-item active"><a href="#">Item Table</a></li>
        </ul>
      </div>
        <div class="col-md-12">
          <div class="tile">
            <h3 class="tile-title">Item Table</h3>
            <table class="table table-hover">
              <thead>
                <tr>
                  <th>SR. No.</th>
                  <th>Item Name</th>
                  <th>Item Details</th>
                  <th>Item Category ID</th>
                  <th>Item Price</th>
                  <th>Item Image</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <?php
                  
                  $q="select * from tbl_item where ngo_id='$ngoid'";
                  $r=mysqli_query($conn,$q);
                  $i=1;
                  while($row=mysqli_fetch_array($r))
                  {
                    echo "<tr>";
                    echo "<td>".$i."</td>";
                    echo "<td>".$row['item_name']."</td>";
                    echo "<td>".$row['item_details']."</td>";
                    echo "<td>".$row['item_category_id']."</td>";
                    echo "<td>".$row['item_price']."</td>";
                    echo "<td>".$row['item_image']."</td>";
                    echo "<td><a href='item-edit.php?iid={$row['item_id']}'>Edit</a> | <a href='?did={$row['item_id']}'>Delete</a> </td>";
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
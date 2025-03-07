<?php
include 'connection.php';


$city = $_GET["city"];

$q = mysqli_query($conn, "select * from tbl_area where city_id ='{$city}'");
?>
<div class="form-group row">
    <label class="control-label col-md-3">Area Name</label>
    <div class="col-md-8">
        <select class="form-control" name="area_id">
            <option>------------------------Select area------------------------</option>
            <?php
            while ($data = mysqli_fetch_row($q)) {

                echo "<option value='{$data[0]}'>$data[1]</option>";

            }
            ?>
        </select>
    </div>
</div>
</div>
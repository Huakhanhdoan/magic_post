<template>
  <v-container>
    <v-row>
      <!-- Quản lý điểm tập kết -->
      <v-col cols="12">
        <v-card>
          <v-card-title>Quản lý điểm Tập kết</v-card-title>
          <v-card-text>
            <v-data-table
              :loading="loading"
              :items="collection_points"
              :headers="collectionHeaders"
              :items-per-page="5"
            ></v-data-table>
            <v-btn @click="showCollectionDialog = true" color="primary"
              >Thêm điểm tập kết</v-btn
            >
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Quản lý điểm giao dịch -->
      <v-col cols="12">
        <v-card>
          <v-card-title>Quản lý điểm Giao dịch</v-card-title>
          <v-card-text>
            <v-data-table
              :loading="loading"
              :items="transaction_points"
              :headers="transactionHeaders"
              :items-per-page="5"
            ></v-data-table>
            <v-btn @click="showTransactionDialog = true" color="primary"
              >Thêm điểm giao dịch</v-btn
            >
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Dialog để thêm điểm giao dịch -->
    <v-dialog v-model="showTransactionDialog" max-width="600px">
      <v-card>
        <v-card-title>Thêm điểm giao dịch</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="addTransactionPoint">
            <v-text-field
              v-model="newTransactionPoint.name"
              label="Tên điểm giao dịch"
            ></v-text-field>
            <v-text-field
              v-model="newTransactionPoint.address"
              label="Địa chỉ"
            ></v-text-field>
            <v-select
              v-model="selectedCollectionPoint"
              :items="collection_points"
              label="Thuộc điểm tập kết"
              item-title="name"
            ></v-select>
            <!-- <v-text-field
              v-model="newTransactionPoint.email"
              label="Tài khoản quản lý"
            ></v-text-field> -->
            <!-- Các trường thông tin khác nếu cần -->

            <v-btn type="submit" color="primary">Lưu</v-btn>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="showTransactionDialog = false">Đóng</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog để thêm điểm tập kết -->
    <v-dialog v-model="showCollectionDialog" max-width="600px">
      <v-card>
        <v-card-title>Thêm điểm tập kết</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="addCollectionPoint">
            <v-text-field
              v-model="newCollectionPoint.name"
              label="Tên điểm tập kết"
            ></v-text-field>
            <v-text-field
              v-model="newCollectionPoint.address"
              label="Địa chỉ"
            ></v-text-field>
            <!-- <v-text-field
              v-model="newCollectionPoint.email"
              label="Tài khoản quản lý"
            ></v-text-field> -->
            <!-- Các trường thông tin khác nếu cần -->

            <v-btn type="submit" color="primary">Lưu</v-btn>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="showCollectionDialog = false">Đóng</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { LeadService } from "../../../service/LeadService";
export default {
  data() {
    return {
      selectedCollectionPoint: null,
      showTransactionDialog: false,
      showCollectionDialog: false,
      collection_points: [],
      transaction_points: [],
      newTransactionPoint: {
        id: "",
        name: "",
        collectionPoint_id: "",
        orders: 0,
        address: "",
        manageAccount: "",
      },
      newCollectionPoint: {
        id: "",
        name: "",
        address: "",
        manageAccount: "",
      },
      transactionHeaders: [
        {
          title: "ID",
          align: "start",
          sortable: false,
          key: "id",
        },
        { title: "Tên điểm giao dịch", key: "name", align: "center" },
        { title: "Địa chỉ", key: "address", align: "center" },
        {
          title: "Thuộc điểm tập kết",
          key: "collectionPoint",
          align: "center",
        },
        { title: "Tổng số đơn hàng", key: "total_shipment", align: "center" },
        { title: "Tài khoản quản lý", key: "manageAccount", align: "center" },
      ],

      collectionHeaders: [
        {
          title: "ID",
          align: "start",
          sortable: false,
          key: "id",
        },
        { title: "Tên điểm tập kết", key: "name", align: "center" },
        { title: "Địa chỉ", key: "address", align: "center" },
        {
          title: "Tổng số đơn hàng nhận",
          key: "receive_shipment",
          align: "center",
        },
        {
          title: "Tổng số đơn hàng chuyển",
          key: "transfer_shipment",
          align: "center",
        },
        { title: "Tài khoản quản lý", key: "manageAccount", align: "center" },
      ],
      loading: false,
    };
  },
  created() {
    this.initialize();
  },
  props: {
    collectionPoints: {
      type: Array,
      required: true,
    },
    transactionPoints: {
      type: Array,
      required: true,
    },
  },
  watch: {
    collectionPoints(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.initialize();
      }
    },
    transactionPoints(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.initialize();
      }
    },
  },

  methods: {
    initialize() {
      this.collection_points = this.collectionPoints;
      this.transaction_points = this.transactionPoints;
      console.log(this.collection_points);
      console.log(this.transaction_points);
    },
    async addTransactionPoint() {
      this.loading = true;
      const selectedCollectionPoint = this.collection_points.find(
        (item) => item.name === this.selectedCollectionPoint
      );
      this.newTransactionPoint.collectionPoint_id = selectedCollectionPoint.id;
      try {
        const res = await LeadService.createTransactionPoint(
          this.newTransactionPoint
        );
        if (res.error_code === 0) {
          this.newTransactionPoint.id = res.data.newPoint.id;
          this.transaction_points.push({ ...this.newTransactionPoint });
          this.showTransactionDialog = false;
          this.loading = false;
        }
      } catch (error) {
        console.error(error);
        this.loading = false;
      }
    },
    async addCollectionPoint() {
      this.loading = true;

      try {
        const res = await LeadService.createCollectionPoint(
          this.newCollectionPoint
        );
        if (res.error_code === 0) {
          this.newCollectionPoint.id = res.data.newPoint.id;
          this.collection_points.push({ ...this.newCollectionPoint });
          this.showCollectionDialog = false;
          this.loading = false;
        }
      } catch (error) {
        console.error(error);
        this.loading = false;
      }
    },
  },
};
</script>
<style scoped></style>

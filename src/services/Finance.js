import ApiService from "./ApiService";

class Finance extends ApiService {
  constructor() {
    super();
    this.path = "api/v1/store";
  }
  async getTransactions(data) {
    try {
      let result = await this.get(`${this.path}/transactions`, this.getLimitOffsetFromParams(data));
      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async pendingAmounts() {
    try {
      return await this.get(`${this.path}/pendingAmount`);
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async releasedAmounts() {
    try {
      return await this.get(`${this.path}/released`);
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async refundedAmounts() {
    try {
      return await this.get(`${this.path}/refundedAmounts`);
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async transferredAmount() {
    try {
      return await this.get(`${this.path}/transferred`);
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async withdrawnAmount() {
    try {
      return await this.get(`${this.path}/withdrawn`);
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async canceledWithdrawnAmount() {
    try {
      return await this.get(`${this.path}/wCanceled`);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getAmountsSummary(payload) {
    try {
      return await this.get(`${this.path}/balance`, payload);
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

export default new Finance();

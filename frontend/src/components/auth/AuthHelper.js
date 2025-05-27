export const getToken = () => {
    const token = localStorage.getItem("token");
    console.log("Token lấy từ localStorage:", token);  // log token ra để kiểm tra
    if (!token) {
      return null;
    }
    return token;
};

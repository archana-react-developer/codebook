function getSession() {
  const token = JSON.parse(sessionStorage.getItem("token"));
  const cbid = JSON.parse(sessionStorage.getItem("cbid"));
  return { token, cbid };
}

export async function getUser() {
  // Simulate an asynchronous operation, e.g., fetching user data from an API
  const browserData = getSession();
  const token = browserData.token;
  const cbid = browserData.cbid;
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await fetch(
    `${process.env.REACT_APP_HOST}/600/users/${cbid}`,
    requestOptions
  );
  if (!response.ok) {
    throw {
      message: response.statusText,
      status: response.status,
    };
  }
  const data = await response.json();
  return data;
}
export async function getUserOrders() {
  const browserData = getSession();
  const token = browserData.token;
  const cbid = browserData.cbid;
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await fetch(
    `${process.env.REACT_APP_HOST}/660/orders?user.id=${cbid}`,
    requestOptions
  );
  if (!response.ok) {
    throw {
      message: response.statusText,
      status: response.status,
    };
  }
  const data = await response.json();
  return data;
}
export async function createOrder(cartList, total, user) {
  // Simulate an asynchronous operation, e.g., creating a new order via an API
  const browserData = getSession();
  const token = browserData.token;

  const order = {
    cartList: cartList,
    amount_paid: total,
    quantity: cartList.length,
    user: {
      name: user.name,
      email: user.email,
      id: user.id,
    },
  };
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json ",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(order),
  };
  const response = await fetch(
    `${process.env.REACT_APP_HOST}/660/orders`,
    requestOptions
  );
  if (!response.ok) {
    throw {
      message: response.statusText,
      status: response.status,
    };
  }
  const data = await response.json();
  return data;
}

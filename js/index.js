const app = angular.module("myApp", ["ngRoute", ]);

app.controller("appController", function($scope) {

});

//config routing
app.config(function($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "./yame.html",

        })
        .when("/login", {
            templateUrl: "./login.html",
        })
        .when("/product/:id/detail", {
            templateUrl: "./chitiet.html",
        })
        .when("/y2010", {
            templateUrl: "./Y2010.html",
        })
        .when("/cart", {
            templateUrl: "./giohang.html",
        })
        .when("/register", {
            templateUrl: "./register.html",
        })
        .otherwise({
            templateUrl: "./error.html",
        });

});
// đăng ký
app.controller("registerController", function($scope, $location,
    $rootScope, $http) {
    $scope.name = '';
    $scope.email = '';
    $scope.password = '';
    $scope.confirmPassword = '';


    $scope.onDangKy = () => {
        $location.path('/register');
    }
});

// đăng nhập
app.controller("loginController", function($scope, $location,
    $rootScope, $http) {

    const token = localStorage.getItem("token");
    if (token) {
        $location.path('/')
    }
    $scope.loading = false;
    $scope.email = '';
    $scope.password = '';
    $scope.onLogin = () => {
        $scope.loading = true;
        $http({
            url: 'https://fpoly-hcm.herokuapp.com/api/auth/login',
            method: "POST",
            data: { email: $scope.email, password: $scope.password }
        }).then(function(response) {
                $scope.loading = false;
                console.log(response);
                localStorage.setItem('token', response.data.data.token);
                $location.path('/');
            },
            function(response) { // optional
                // failed
                $scope.loading = false;
                alert('thất bại')
            }
        );

    }
    $scope.onLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('cart');
        $location.path('/login');
    }

});

// lấy danh sách sản phẩm

app.controller("yameController", function($scope, $location,
    $rootScope, $http) {
    $scope.products = [];
    $scope.products1 = [];
    $scope.oneProduct = {};

    $scope.getProduct = () => {
        const token = localStorage.getItem('token');
        $http({
            url: 'https://fpoly-hcm.herokuapp.com/api/products/get-all',
            method: "GET",
            headers: { 'Authorization': 'Bearer ' + token }
        }).then(function(response) {
                console.log(response);
                let _products = response.data.data;
                let data = [];
                for (let index = 0; index < _products.length; index += 4) {
                    let row = [];
                    row.push(_products[index]);
                    row.push(_products[index + 1]);
                    row.push(_products[index + 2]);
                    row.push(_products[index + 3]);
                    data.push(row);
                }
                $scope.products = data;


                let data1 = [];
                for (let index = 0; index <= 0; index++) {
                    let row1 = [];
                    row1.push(_products[index]);

                    data1.push(row1);
                }
                $scope.products1 = data1;
            },
            function(response) { // optional
                console.log(response);
            }
        );
    }
    $scope.getProduct();
    // $scope.isLoading = () => $scope.products.length == 0; // loading đợi trang chủ

});




// trang chi tiết
app.controller("chiTietController", function($scope, $location,
    $rootScope, $http, $routeParams) {
    $scope.cart = JSON.parse(localStorage.getItem('cart')) || [];
    $scope.oneProduct = {};
    $scope.getOneProductById = (id) => {
        const token = localStorage.getItem('token');
        $http({
            url: 'https://fpoly-hcm.herokuapp.com/api/products/get-by-id?id=' + id,
            method: "GET",
            headers: { 'Authorization': 'Bearer ' + token }
        }).then(function(response) {



                console.log(response);
                $scope.oneProduct = response.data.data;

            },
            function(response) { // optional
                // failed


                console.log(response);
            }
        );
    }
    $scope.getOneProductById($routeParams.id);

    $scope.addToCart = (product) => {
        let index = $scope.cart.findIndex(item => item._id == product._id);
        if (index == -1) {
            $scope.cart.push({
                ...product,
                quantity: 1,
            });
        } else {
            $scope.cart[index].quantity++;
        }
        localStorage.setItem('cart', JSON.stringify($scope.cart));
        console.log($scope.cart);
    }


});
// giỏ hàng
app.controller("cartController", function($scope, $location,
    $rootScope, $http) {
    $scope.cart = JSON.parse(localStorage.getItem('cart')) || [];

    $scope.removeItem = (product) => {
        let index = $scope.cart.findIndex(item => item._id == product._id);
        $scope.cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify($scope.cart));
        console.log(index, 1);
    }

    // thay đổi số lượng
    $scope.onChangeQuantity = (id) => {
        localStorage.setItem('cart', JSON.stringify($scope.cart));
    };




    $scope.info = {
        name: '',
        phone: '',
        address: '',
        email: '',
        products: []
    };

    // tính tổng tiền

    $scope.getTotal = () => {
        let total = 0;
        for (let index = 0; index < $scope.cart.length; index++) {
            const product = $scope.cart[index];
            total += product.quantity * product.price;
        }
        return total
    };


    // thanh toán giỏ hàng
    $scope.checkout = () => {

        let data = {
            ...$scope.info,
            products: $scope.cart.map(item => {
                return {
                    id: item._id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                }
            })
        }
        const token = localStorage.getItem('token');

        $http({
            url: 'https://fpoly-hcm.herokuapp.com/api/carts/add',
            method: "POST",
            headers: { 'Authorization': 'Bearer ' + token },
            data: data
        }).then(function(response) {
                console.log(response);
                localStorage.removeItem('cart');
                // swal("Thanh toán thành công!", "You  clicked the button!", "Quay Lại");
                alert('Thanh toán thành công!')
                $location.path('/');
                alert

            },
            function(response) { // optional
                // failed

                alert('Thanh toán thất bại')
            }
        );

    };

});
// y2010
app.controller("y2010Controller", function($scope, $location,
    $rootScope, $http) {
    $scope.products = [];
    $scope.getY2010 = () => {
        const token = localStorage.getItem('token');
        $http({
            url: 'https://fpoly-hcm.herokuapp.com/api/products/get-all',
            method: "GET",
            headers: { 'Authorization': 'Bearer ' + token }
        }).then(function(response) {
                console.log(response);
                let _products = response.data.data;
                let data = [];
                for (let index = 0; index < _products.length; index += 4) {
                    let row = [];
                    row.push(_products[index]);
                    row.push(_products[index + 1]);
                    row.push(_products[index + 2]);
                    row.push(_products[index + 3]);
                    data.push(row);
                }
                $scope.products = data;

            },
            function(response) { // optional
                console.log(response);
            }
        );
    }
    $scope.getY2010();
    // $scope.isLoading = () => $scope.products.length == 0; // loading đợi trang chủ

});
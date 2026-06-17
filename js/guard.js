

(function executeSecurityShield() {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userRole");

    const currentPage = window.location.pathname.split("/").pop();

    const publicPages = ["01_login.html", "02_Register.html", "unauthorized.html"];

    if (!token && !publicPages.includes(currentPage) && currentPage !== "") {
        window.location.href = "01_login.html";
        return;
    }

    if (token && (currentPage === "01_login.html" || currentPage === "02_Register.html")) {
        redirectUserToHome(role);
        return;
    }

    const teacherAccessPages = [
    "04_Teacher-Dashboard.html",
    "13_Create-Course.html",
    "05_Quiz-Creator.html",
    "06_upload-material.html",
    "07_teacher-analytics.html"
];

    const adminAccessPages = [
        "08_Admin-Dashboard.html"
    ];

    const studentAccessPages = [
        "03_Student-Dashboard.html",
        "09_Course.html"
    ];

    // ✅ Shared pages — accessible by both STUDENT and TEACHER
    const sharedPages = [
        "10_Course-detail.html",
        "11_Quiz.html",
        "12_Result.html"
    ];

    if (teacherAccessPages.includes(currentPage) && role !== "TEACHER") {
        console.warn(`Security Breach Intercepted: Access to ${currentPage} denied for role ${role}`);
        window.location.href = "unauthorized.html";
        return;
    }

    if (adminAccessPages.includes(currentPage) && role !== "ADMIN") {
        console.warn(`Security Breach Intercepted: Access to ${currentPage} denied for role ${role}`);
        window.location.href = "unauthorized.html";
        return;
    }

    if (studentAccessPages.includes(currentPage) && role !== "STUDENT") {
        console.warn(`Security Breach Intercepted: Access to ${currentPage} denied for role ${role}`);
        redirectUserToHome(role);
        return;
    }

    // ✅ Shared pages: only block ADMIN from accessing them
    if (sharedPages.includes(currentPage) && role === "ADMIN") {
        redirectUserToHome(role);
        return;
    }

})();

function redirectUserToHome(role) {
    if (role === "TEACHER") {
        window.location.href = "04_Teacher-Dashboard.html";
    } else if (role === "ADMIN") {
        window.location.href = "08_Admin-Dashboard.html";
    } else {
        window.location.href = "03_Student-Dashboard.html";
    }
}

function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName");
    console.log("Session token status revoked. Redirecting to sign-in panel.");
    window.location.href = "01_login.html";
}       
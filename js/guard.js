/**
 * EduSphere AI - Client-Side Security & Role-Based Access Control (RBAC)
 * Enforces secure navigation boundaries before pages render to the user.
 */

(function executeSecurityShield() {
    // 1. Retrieve the saved session variables from the browser storage
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userRole");

    // Extract the active file name from the browser's current window path
    const currentPage = window.location.pathname.split("/").pop();

    // Whitelist pages that any unauthenticated public visitor can access
    const publicPages = ["01_login.html", "02_Register.html", "unauthorized.html"];

    // 2. Authentication Check: If not logged in and trying to access a private dashboard
    if (!token && !publicPages.includes(currentPage) && currentPage !== "") {
        window.location.href = "01_login.html";
        return;
    }

    // 3. Prevent logged-in users from manually navigating back to login/register pages
    if (token && (currentPage === "01_login.html" || currentPage === "02_Register.html")) {
        redirectUserToHome(role);
        return;
    }

    // 4. Group your structural pages into restricted security role categories
    const teacherAccessPages = [
        "04_Teacher-Dashboard.html",
        "05_Quiz-Creator.html",
        "06_Upload-material.html",
        "07_Teacher-analytics.html"
    ];

    const adminAccessPages = [
        "08_Admin-Dashboard.html"
    ];

    const studentAccessPages = [
        "03_Student-Dashboard.html",
        "09_Course.html",
        "10_Course-detail.html",
        "11_Quiz.html",
        "12_Result.html"
    ];

    // 5. Enforce boundaries against Teacher-restricted application files
    if (teacherAccessPages.includes(currentPage) && role !== "TEACHER") {
        console.warn(`Security Breach Intercepted: Access to ${currentPage} denied for role ${role}`);
        window.location.href = "unauthorized.html";
        return;
    }

    // 6. Enforce boundaries against Administrator-restricted application files
    if (adminAccessPages.includes(currentPage) && role !== "ADMIN") {
        console.warn(`Security Breach Intercepted: Access to ${currentPage} denied for role ${role}`);
        window.location.href = "unauthorized.html";
        return;
    }

    // 7. Enforce boundaries against Student-restricted application files
    if (studentAccessPages.includes(currentPage) && role !== "STUDENT") {
        console.warn(`Security Breach Intercepted: Access to ${currentPage} denied for role ${role}`);
        // If a Teacher or Admin wanders onto a student page, send them back to their home space
        redirectUserToHome(role);
        return;
    }
})();

/**
 * Helper utility to cleanly direct an identity profile back to their assigned workspace
 * @param {string} role - The explicit system role string (STUDENT, TEACHER, ADMIN)
 */
function redirectUserToHome(role) {
    if (role === "TEACHER") {
        window.location.href = "04_Teacher-Dashboard.html";
    } else if (role === "ADMIN") {
        window.location.href = "08_Admin-Dashboard.html";
    } else {
        window.location.href = "03_Student-Dashboard.html";
    }
}

/**
 * Global application log-out coordinator. Clears all active session tokens 
 * from the local browser state storage cache and cleanly handles session exits.
 */
function handleLogout() {
    // Flush storage variables entirely to prevent token reuse or layout spoofing
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName");
    
    console.log("Session token status revoked. Redirecting to sign-in panel.");
    
    // Hard route redirect straight to login portal
    window.location.href = "01_login.html";
}
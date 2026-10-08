package com.smartwaste.config;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SpaForwardController {

    /**
     * Forwards frontend routes to index.html so React Router can handle client-side routing on page refresh.
     * Excludes /api/**, /h2-console/**, and static assets with extensions (.js, .css, .ico, etc.).
     */
    @GetMapping(value = {
            "/",
            "/login",
            "/role",
            "/citizen/**",
            "/worker/**",
            "/authority/**",
            "/notifications",
            "/profile",
            "/{path:[^\\.]*}"
    })
    public String forwardToSpa() {
        return "forward:/index.html";
    }
}

package com.fynd.task2.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fynd.task2.dto.ErrorResponseDto;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
@Slf4j
public class AdminTokenInterceptor implements HandlerInterceptor {

    private static final String ADMIN_TOKEN_HEADER = "X-ADMIN-TOKEN";

    @Value("${admin.token}")
    private String adminToken;

    private final ObjectMapper objectMapper;

    public AdminTokenInterceptor(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        // Skip preflight requests (OPTIONS)
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            return true;
        }

        String providedToken = request.getHeader(ADMIN_TOKEN_HEADER);

        if (providedToken == null || providedToken.isBlank()) {
            log.warn("Admin token missing in request to: {}", request.getRequestURI());
            sendUnauthorizedResponse(response, "Admin token is required");
            return false;
        }

        if (!adminToken.equals(providedToken)) {
            log.warn("Invalid admin token provided for request to: {}", request.getRequestURI());
            sendUnauthorizedResponse(response, "Invalid admin token");
            return false;
        }

        return true;
    }

    private void sendUnauthorizedResponse(HttpServletResponse response, String message) throws Exception {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);

        ErrorResponseDto errorResponse = ErrorResponseDto.of("UNAUTHORIZED", message);
        response.getWriter().write(objectMapper.writeValueAsString(errorResponse));
    }
}


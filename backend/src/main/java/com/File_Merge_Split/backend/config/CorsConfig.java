package com.File_Merge_Split.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Configuration
public class CorsConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        // Read production origins from environment variable
        String envOrigins = System.getenv("CORS_ALLOWED_ORIGINS");

        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {

                // Default: allow all localhost ports
                List<String> localhostOrigins = Arrays.asList(
                        "http://localhost:5173",
                        "http://127.0.0.1:8080"
                );

                // Merge production origins if any
                List<String> allowedOrigins;
                if (envOrigins != null && !envOrigins.isEmpty()) {
                    List<String> prodOrigins = Arrays.stream(envOrigins.split(","))
                            .map(String::trim)
                            .collect(Collectors.toList());
                    allowedOrigins = prodOrigins;
                    // Optional: also include localhost for dev testing
                    allowedOrigins.addAll(localhostOrigins);
                } else {
                    allowedOrigins = localhostOrigins; // dev only
                }

                registry.addMapping("/**")
                        .allowedOrigins(allowedOrigins.toArray(new String[0]))
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*")
                        .allowCredentials(true);
            }
        };
    }
}

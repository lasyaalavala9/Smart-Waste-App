package com.smartwaste.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.util.StringUtils;

import javax.sql.DataSource;
import java.net.URI;

@Configuration
public class DataSourceConfig {

    private static final Logger log = LoggerFactory.getLogger(DataSourceConfig.class);

    @Value("${DATABASE_URL:#{null}}")
    private String databaseUrlEnv;

    @Value("${spring.datasource.url:#{null}}")
    private String springDatasourceUrl;

    @Value("${DATABASE_USERNAME:#{null}}")
    private String databaseUsernameEnv;

    @Value("${spring.datasource.username:#{null}}")
    private String springDatasourceUsername;

    @Value("${DATABASE_PASSWORD:#{null}}")
    private String databasePasswordEnv;

    @Value("${spring.datasource.password:#{null}}")
    private String springDatasourcePassword;

    @Bean
    @Primary
    public DataSource dataSource() {
        String rawUrl = StringUtils.hasText(databaseUrlEnv) ? databaseUrlEnv : springDatasourceUrl;
        String username = StringUtils.hasText(databaseUsernameEnv) ? databaseUsernameEnv : springDatasourceUsername;
        String password = StringUtils.hasText(databasePasswordEnv) ? databasePasswordEnv : springDatasourcePassword;

        // If a PostgreSQL URL is configured via environment variables
        if (StringUtils.hasText(rawUrl)) {
            try {
                if (rawUrl.startsWith("postgres://") || rawUrl.startsWith("postgresql://")) {
                    log.info("Configuring PostgreSQL DataSource from URI connection string");
                    URI uri = new URI(rawUrl);

                    String host = uri.getHost();
                    int port = uri.getPort() > 0 ? uri.getPort() : 5432;
                    String path = uri.getPath();

                    String jdbcUrl = "jdbc:postgresql://" + host + ":" + port + path;

                    if (!StringUtils.hasText(username) && uri.getUserInfo() != null) {
                        String[] parts = uri.getUserInfo().split(":", 2);
                        username = parts[0];
                        if (parts.length > 1 && !StringUtils.hasText(password)) {
                            password = parts[1];
                        }
                    }

                    return DataSourceBuilder.create()
                            .url(jdbcUrl)
                            .username(username)
                            .password(password)
                            .driverClassName("org.postgresql.Driver")
                            .build();
                } else if (rawUrl.startsWith("jdbc:postgresql:")) {
                    log.info("Configuring PostgreSQL DataSource from JDBC URL: {}", rawUrl);
                    return DataSourceBuilder.create()
                            .url(rawUrl)
                            .username(username)
                            .password(password)
                            .driverClassName("org.postgresql.Driver")
                            .build();
                } else if (rawUrl.startsWith("jdbc:h2:")) {
                    log.info("Configuring H2 DataSource from explicitly provided URL");
                    return DataSourceBuilder.create()
                            .url(rawUrl)
                            .username(StringUtils.hasText(username) ? username : "sa")
                            .password(password != null ? password : "")
                            .driverClassName("org.h2.Driver")
                            .build();
                }
            } catch (Exception ex) {
                log.error("Failed to parse database URL, falling back to local H2: {}", ex.getMessage());
            }
        }

        // Local Development Fallback: In-memory H2 database
        log.info("No external PostgreSQL DATABASE_URL detected. Starting with internal H2 database for development.");
        return DataSourceBuilder.create()
                .url("jdbc:h2:mem:smartwastedb;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE")
                .username("sa")
                .password("")
                .driverClassName("org.h2.Driver")
                .build();
    }
}

package com.fitempire.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;

@Configuration
public class AwsConfig {

    @Value("${app.aws.access-key-id}")
    private String accessKeyId;

    @Value("${app.aws.secret-access-key}")
    private String secretAccessKey;

    @Value("${app.aws.region}")
    private String region;

    @Bean
    public S3Client s3Client() {
        if (accessKeyId == null || accessKeyId.isBlank() || secretAccessKey == null || secretAccessKey.isBlank()) {
            return (S3Client) java.lang.reflect.Proxy.newProxyInstance(
                    S3Client.class.getClassLoader(),
                    new Class<?>[]{S3Client.class},
                    (proxy, method, args1) -> {
                        if (method.getName().equals("toString")) {
                            return "MockedS3ClientProxy";
                        }
                        if (method.getName().equals("hashCode")) {
                            return System.identityHashCode(proxy);
                        }
                        if (method.getName().equals("equals")) {
                            return proxy == args1[0];
                        }
                        if (method.getName().equals("close")) {
                            return null;
                        }
                        Class<?> returnType = method.getReturnType();
                        if (returnType.isPrimitive()) {
                            if (returnType == boolean.class) return false;
                            if (returnType == int.class) return 0;
                            if (returnType == long.class) return 0L;
                            if (returnType == double.class) return 0.0;
                            if (returnType == float.class) return 0.0f;
                        }
                        return null;
                    }
            );
        }
        return S3Client.builder()
                .region(Region.of(region))
                .credentialsProvider(
                        StaticCredentialsProvider.create(
                                AwsBasicCredentials.create(accessKeyId, secretAccessKey)
                        )
                )
                .build();
    }
}

package uth.edu.vn.Eventix.Payment.Util;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;
import java.util.Map;
import java.util.stream.Collectors;

public class MomoUtil {

    public static String signRequest(Map<String, Object> requestBody, String secretKey) throws Exception {
        String rawData = requestBody.entrySet().stream()
                .sorted(Map.Entry.comparingByKey())
                .map(entry -> entry.getKey() + "=" + entry.getValue())
                .collect(Collectors.joining("&"));

        Mac hmac = Mac.getInstance("HmacSHA256");
        SecretKeySpec secretKeySpec = new SecretKeySpec(secretKey.getBytes(), "HmacSHA256");
        hmac.init(secretKeySpec);

        byte[] hash = hmac.doFinal(rawData.getBytes());
        return Base64.getEncoder().encodeToString(hash);
    }
}

package uth.edu.vn.identityservice.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;

@Service
public class JwtService {

    // Secret phải >=32 bytes cho HS256
    private static final String SECRET_STRING = "mysecretkeymysecretkeymysecretkeymysecretkey";
    private final Key key = Keys.hmacShaKeyFor(SECRET_STRING.getBytes());

    // Tạo token 1 giờ
    public String generateToken(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60)) // 1h
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    // Lấy username từ token
    public String extractUsername(String token) {
        return getClaims(token).getSubject();
    }

    // Kiểm tra token có hợp lệ với UserDetails
    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    // Kiểm tra token hết hạn
    private boolean isTokenExpired(String token) {
        return getClaims(token).getExpiration().before(new Date());
    }

    // Lấy toàn bộ claims
    private Claims getClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}

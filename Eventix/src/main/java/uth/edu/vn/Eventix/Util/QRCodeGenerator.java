package uth.edu.vn.Eventix.Util;

import com.google.zxing.*;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

public class QRCodeGenerator {
    public static String generateQRCode(String text, String filePath) throws Exception {
        // Tạo thư mục nếu chưa tồn tại
        Path path = Paths.get(filePath);
        Files.createDirectories(path.getParent());
        
        BitMatrix matrix = new MultiFormatWriter()
                .encode(text, BarcodeFormat.QR_CODE, 300, 300);
        MatrixToImageWriter.writeToPath(matrix, "PNG", path);
        return filePath;
    }
}


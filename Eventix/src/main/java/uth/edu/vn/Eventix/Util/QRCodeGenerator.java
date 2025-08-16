package uth.edu.vn.Eventix.Util;

import com.google.zxing.*;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;

import java.io.File;
import java.nio.file.Path;

public class QRCodeGenerator {
    public static String generateQRCode(String text, String filePath) throws Exception {
        BitMatrix matrix = new MultiFormatWriter()
                .encode(text, BarcodeFormat.QR_CODE, 300, 300);
        Path path = new File(filePath).toPath();
        MatrixToImageWriter.writeToPath(matrix, "PNG", path);
        return filePath;
    }
}


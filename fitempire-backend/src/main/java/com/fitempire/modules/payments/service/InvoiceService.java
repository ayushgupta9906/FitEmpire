package com.fitempire.modules.payments.service;

import com.fitempire.modules.payments.entity.Payment;
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.colors.DeviceRgb;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

@Slf4j
@Service
@RequiredArgsConstructor
public class InvoiceService {

    private final com.fitempire.modules.payments.repository.InvoiceRepository invoiceRepository;
    private final com.fitempire.service.StorageService storageService;

    private static final AtomicLong invoiceCounter = new AtomicLong(1000);

    public void generateInvoice(Payment payment) {
        try {
            String invoiceNumber = "FE-INV-" + System.currentTimeMillis();
            byte[] pdfBytes = generateInvoicePdf(payment, invoiceNumber);

            String pdfUrl = storageService.uploadFile(
                    "invoices/" + payment.getId() + ".pdf",
                    pdfBytes,
                    "application/pdf"
            );

            // Save invoice record
            var invoice = new com.fitempire.modules.payments.entity.Invoice();
            invoice.setPayment(payment);
            invoice.setUser(payment.getUser());
            invoice.setInvoiceNumber(invoiceNumber);
            invoice.setSubtotal(payment.getAmount());
            invoice.setGstRate(java.math.BigDecimal.valueOf(18.0));
            invoice.setGstAmount(payment.getGstAmount());
            invoice.setDiscount(payment.getDiscountAmount());
            invoice.setTotal(payment.getNetAmount());
            invoice.setPdfUrl(pdfUrl);
            invoiceRepository.save(invoice);

            log.info("Invoice generated: {} for payment: {}", invoiceNumber, payment.getId());
        } catch (Exception e) {
            log.error("Failed to generate invoice for payment {}: {}", payment.getId(), e.getMessage(), e);
        }
    }

    private byte[] generateInvoicePdf(Payment payment, String invoiceNumber) throws Exception {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(baos);
        PdfDocument pdf = new PdfDocument(writer);
        Document document = new Document(pdf);

        DeviceRgb purple = new DeviceRgb(108, 99, 255);
        DeviceRgb dark = new DeviceRgb(26, 26, 46);

        // Header
        document.add(new Paragraph("FitEmpire")
                .setFontSize(28)
                .setBold()
                .setFontColor(purple));

        document.add(new Paragraph("TAX INVOICE")
                .setFontSize(18)
                .setFontColor(dark));

        document.add(new Paragraph("Invoice No: " + invoiceNumber));
        document.add(new Paragraph("Date: " + java.time.LocalDate.now().format(DateTimeFormatter.ISO_DATE)));
        document.add(new Paragraph("Payment ID: " + payment.getId().toString()));
        document.add(new Paragraph("\n"));

        // Bill To
        document.add(new Paragraph("Bill To:").setBold());
        document.add(new Paragraph(payment.getUser().getFullName()));
        document.add(new Paragraph(payment.getUser().getEmail()));
        document.add(new Paragraph("\n"));

        // Items table
        Table table = new Table(UnitValue.createPercentArray(new float[]{60, 20, 20}))
                .useAllAvailableWidth();
        table.addHeaderCell(new Cell().add(new Paragraph("Description").setBold()));
        table.addHeaderCell(new Cell().add(new Paragraph("Amount").setBold().setTextAlignment(TextAlignment.RIGHT)));
        table.addHeaderCell(new Cell().add(new Paragraph("Total").setBold().setTextAlignment(TextAlignment.RIGHT)));

        table.addCell(new Cell().add(new Paragraph(payment.getDescription() != null ? payment.getDescription() : "Membership")));
        table.addCell(new Cell().add(new Paragraph("₹" + payment.getAmount()).setTextAlignment(TextAlignment.RIGHT)));
        table.addCell(new Cell().add(new Paragraph("₹" + payment.getAmount()).setTextAlignment(TextAlignment.RIGHT)));

        if (payment.getDiscountAmount().compareTo(java.math.BigDecimal.ZERO) > 0) {
            table.addCell(new Cell().add(new Paragraph("Discount")));
            table.addCell(new Cell().add(new Paragraph("-₹" + payment.getDiscountAmount()).setTextAlignment(TextAlignment.RIGHT)));
            table.addCell(new Cell().add(new Paragraph("-₹" + payment.getDiscountAmount()).setTextAlignment(TextAlignment.RIGHT)));
        }

        table.addCell(new Cell().add(new Paragraph("GST (18%)")));
        table.addCell(new Cell().add(new Paragraph("₹" + payment.getGstAmount()).setTextAlignment(TextAlignment.RIGHT)));
        table.addCell(new Cell().add(new Paragraph("₹" + payment.getGstAmount()).setTextAlignment(TextAlignment.RIGHT)));

        table.addCell(new Cell().add(new Paragraph("TOTAL").setBold()));
        table.addCell(new Cell().add(new Paragraph("").setTextAlignment(TextAlignment.RIGHT)));
        table.addCell(new Cell().add(new Paragraph("₹" + payment.getNetAmount()).setBold().setTextAlignment(TextAlignment.RIGHT)));

        document.add(table);

        document.add(new Paragraph("\n\nThank you for choosing FitEmpire! 💪")
                .setFontColor(purple)
                .setTextAlignment(TextAlignment.CENTER));

        document.add(new Paragraph("fitempire.in | support@fitempire.in | GSTIN: 27AABCF1234A1Z5")
                .setFontSize(9)
                .setFontColor(ColorConstants.GRAY)
                .setTextAlignment(TextAlignment.CENTER));

        document.close();
        return baos.toByteArray();
    }
}

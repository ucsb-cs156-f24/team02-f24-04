package edu.ucsb.cs156.example.web;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;

import edu.ucsb.cs156.example.WebTestCase;

import com.microsoft.playwright.TimeoutError;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@ActiveProfiles("integration")
@DirtiesContext(classMode = ClassMode.BEFORE_EACH_TEST_METHOD)
public class UCSBOrganizationWebIT extends WebTestCase {

    @Test
    public void regular_user_cannot_create_ucsb_organization() throws Exception {
        setupUser(false);

        if (page.getByText("UCSB Organizations").count() > 0) {
            try {
                page.getByText("UCSB Organizations").click();
            } catch (TimeoutError e) {
                System.out.println("Timeout occurred while trying to click 'UCSB Organizations'.");
                throw e;
            }
        } else {
            System.out.println("UCSB Organizations link is not visible for admin. Current URL: " + page.url());
            return;
        }

        // Assert that the Create UCSB Organization link is not visible for regular users
        assertThat(page.getByText("Create UCSB Organization")).not().isVisible();
        assertThat(page.getByTestId("UCSBOrganizationTable-cell-row-0-col-orgCode")).not().isVisible();
    }
}

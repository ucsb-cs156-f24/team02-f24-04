package edu.ucsb.cs156.example.integration;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import com.fasterxml.jackson.databind.ObjectMapper;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;

import edu.ucsb.cs156.example.entities.HelpRequest;
import edu.ucsb.cs156.example.repositories.HelpRequestRepository;
import edu.ucsb.cs156.example.repositories.UserRepository;
import edu.ucsb.cs156.example.services.CurrentUserService;
import edu.ucsb.cs156.example.services.GrantedAuthoritiesService;
import edu.ucsb.cs156.example.testconfig.TestConfig;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@ActiveProfiles("integration")
@Import(TestConfig.class)
@DirtiesContext(classMode = ClassMode.BEFORE_EACH_TEST_METHOD)
public class HelpRequestIT {

    @Autowired
    public CurrentUserService currentUserService;

    @Autowired
    public GrantedAuthoritiesService grantedAuthoritiesService;

    @Autowired
    HelpRequestRepository helpRequestRepository;

    @Autowired
    public MockMvc mockMvc;

    @Autowired
    public ObjectMapper mapper;

    @MockBean
    UserRepository userRepository;

    @WithMockUser(roles = { "ADMIN" })
    @Test
    public void an_admin_user_can_post_a_new_help_request() throws Exception {
        // arrange
        String requesterEmail = "test@example.com";
        String teamId = "team1";
        String tableOrBreakoutRoom = "Table 5";
        LocalDateTime requestTime = LocalDateTime.now();
        String requestTimeStr = requestTime.format(DateTimeFormatter.ISO_DATE_TIME);
        String explanation = "Need assistance with debugging";
        boolean solved = false;

        HelpRequest expectedHelpRequest = HelpRequest.builder()
                .requesterEmail(requesterEmail)
                .teamId(teamId)
                .tableOrBreakoutRoom(tableOrBreakoutRoom)
                .requestTime(requestTime)
                .explanation(explanation)
                .solved(solved)
                .build();

        // act
        MvcResult response = mockMvc.perform(
                post("/api/helprequest/post")
                        .param("requesterEmail", requesterEmail)
                        .param("teamId", teamId)
                        .param("tableOrBreakoutRoom", tableOrBreakoutRoom)
                        .param("requestTime", requestTimeStr)
                        .param("explanation", explanation)
                        .param("solved", String.valueOf(solved))
                        .with(csrf()))
                .andExpect(status().isOk())
                .andReturn();

        

        // verify the new entry exists in the repository
        HelpRequest savedRequest = helpRequestRepository.findAll().iterator().next();
        assertEquals(requesterEmail, savedRequest.getRequesterEmail());
        assertEquals(teamId, savedRequest.getTeamId());
        assertEquals(tableOrBreakoutRoom, savedRequest.getTableOrBreakoutRoom());
        assertEquals(requestTime, savedRequest.getRequestTime());
        assertEquals(explanation, savedRequest.getExplanation());
        assertEquals(solved, savedRequest.getSolved());
    }
}

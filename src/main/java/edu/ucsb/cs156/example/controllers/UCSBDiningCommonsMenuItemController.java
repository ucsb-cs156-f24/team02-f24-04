package edu.ucsb.cs156.example.controllers;

import edu.ucsb.cs156.example.entities.UCSBDate;
import edu.ucsb.cs156.example.entities.UCSBDiningCommonMenuItem;
import edu.ucsb.cs156.example.errors.EntityNotFoundException;
import edu.ucsb.cs156.example.repositories.UCSBDateRepository;
import edu.ucsb.cs156.example.repositories.UCSBDiningCommonsMenuItemRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;

import com.fasterxml.jackson.core.JsonProcessingException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

import java.time.LocalDateTime;

@Tag(name = "UCSBDiningCommonsMenuItem")
@RequestMapping("/api/ucsbdiningcommonsmenuitem")
@RestController
@Slf4j

public class UCSBDiningCommonsMenuItemController extends ApiController {
    @Autowired
    UCSBDiningCommonsMenuItemRepository ucsbDiningCommonsMenuItemRepository;

    @Operation(summary= "List all menu items")
    @PreAuthorize("hasRole('ROLE_USER')")
    @GetMapping("/all")
    public Iterable<UCSBDiningCommonMenuItem> allUCSBDiningCommonsMenuItems() {
        Iterable<UCSBDiningCommonMenuItem> menuItem = ucsbDiningCommonsMenuItemRepository.findAll();
        return menuItem;
    }

    @Operation(summary= "Get a single menu item")
    @PreAuthorize("hasRole('ROLE_USER')")
    @GetMapping("")
    public UCSBDiningCommonMenuItem getById(
            @Parameter(name="id") @RequestParam Long id) {
        UCSBDiningCommonMenuItem ucsbDiningCommonMenuItem = ucsbDiningCommonsMenuItemRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(UCSBDiningCommonMenuItem.class, id));

        return ucsbDiningCommonMenuItem;
    }

    @Operation(summary= "Create a new menu item")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping("/post")
    public UCSBDiningCommonMenuItem postUCSBDiningCommonsMenuItem(
        @Parameter(name="diningCommonsCode") @RequestParam String diningCommonsCode,
        @Parameter(name="name") @RequestParam String name,
        @Parameter(name="station") @RequestParam String station)
        throws JsonProcessingException {

    // For an explanation of @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    // See: https://www.baeldung.com/spring-date-parameters

    //log.info("localDateTime={}", localDateTime);

    UCSBDiningCommonMenuItem ucsbDiningCommonMenuItem = new UCSBDiningCommonMenuItem();
    ucsbDiningCommonMenuItem.setDiningCommonsCode(diningCommonsCode);
    ucsbDiningCommonMenuItem.setName(name);
    ucsbDiningCommonMenuItem.setStation(station);

    UCSBDiningCommonMenuItem savedUcsbDiningCommonMenuItem = ucsbDiningCommonsMenuItemRepository.save(ucsbDiningCommonMenuItem);

    return savedUcsbDiningCommonMenuItem;
}

    @Operation(summary= "Delete a menu item")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping("")
    public Object deleteUCSBDiningCommonMenuItem(
            @Parameter(name="id") @RequestParam Long id) {
        UCSBDiningCommonMenuItem ucsbDiningCommonMenuItem = ucsbDiningCommonsMenuItemRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(UCSBDiningCommonMenuItem.class, id));

        ucsbDiningCommonsMenuItemRepository.delete(ucsbDiningCommonMenuItem);
        return genericMessage("UCSBDiningCommonMenuItem with id %s deleted".formatted(id));
    }

    @Operation(summary= "Update a single menu item")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PutMapping("")
    public UCSBDiningCommonMenuItem updateUCSBDiningCommonMenuItem(
            @Parameter(name="id") @RequestParam Long id,
            @RequestBody @Valid UCSBDiningCommonMenuItem incoming) {

        UCSBDiningCommonMenuItem ucsbDiningCommonMenuItem = ucsbDiningCommonsMenuItemRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(UCSBDiningCommonMenuItem.class, id));

        ucsbDiningCommonMenuItem.setDiningCommonsCode(incoming.getDiningCommonsCode());
        ucsbDiningCommonMenuItem.setName(incoming.getName());
        ucsbDiningCommonMenuItem.setStation(incoming.getStation());

        ucsbDiningCommonsMenuItemRepository.save(ucsbDiningCommonMenuItem);

        return ucsbDiningCommonMenuItem;
    }

}

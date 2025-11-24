package com.safedish.backend.rdb.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@NoArgsConstructor
@Table(name = "options", schema = "safedish")
public class Option {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Setter
    @Column(nullable = false)
    private String name;

    @Setter
    @Column(nullable = false)
    private Long price;

    @Setter
    @Column(name = "allergy_mask", nullable = false, columnDefinition = "BIGINT")
    private long allergyMask;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "menu_id", nullable = false)
    private Menu menu;

    public Option(String name, Long price, Long allergyMask, Menu menu) {
        this.name = name;
        this.price = price;
        this.allergyMask = allergyMask;
        this.menu = menu;
    }
}

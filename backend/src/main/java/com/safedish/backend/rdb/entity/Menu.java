package com.safedish.backend.rdb.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor
@Table(name = "menus", schema = "safedish")
public class Menu {
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

    @OneToMany(mappedBy = "menu", cascade = CascadeType.REMOVE)
    private List<Option> options = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "store_id", nullable = false)
    private Store store;

    public Menu(String name, Long price, long allergyMask, Store store) {
        this.name = name;
        this.price = price;
        this.allergyMask = allergyMask;
        this.store = store;
    }
}

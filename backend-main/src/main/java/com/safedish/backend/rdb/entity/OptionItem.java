package com.safedish.backend.rdb.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@NoArgsConstructor
@Table(name = "option_items", schema = "safedish")
public class OptionItem {
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
    private Long allergyMask;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "option_group_id", nullable = false)
    private OptionGroup group;

    public OptionItem(String name, Long price, Long allergyMask, OptionGroup group) {
        this.name = name;
        this.price = price;
        this.allergyMask = allergyMask;
        this.group = group;
    }
}

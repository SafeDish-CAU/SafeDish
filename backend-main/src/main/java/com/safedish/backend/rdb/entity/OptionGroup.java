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
@Table(name = "option_groups", schema = "safedish")
public class OptionGroup {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Setter
    @Column(nullable = false)
    private String name;

    @Setter
    @Column(nullable = false)
    private Long minSelected;

    @Setter
    @Column(nullable = false)
    private Long maxSelected;

    @OneToMany(mappedBy = "group", cascade = CascadeType.REMOVE)
    private List<OptionItem> items = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "menu_id", nullable = false)
    private Menu menu;

    public OptionGroup(String name, Long minSelected, Long maxSelected, Menu menu) {
        this.name = name;
        this.minSelected = minSelected;
        this.maxSelected = maxSelected;
        this.menu = menu;
    }
}

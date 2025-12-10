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
@Table(name = "stores", schema = "safedish")
public class Store {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Setter
    @Column(nullable = false)
    private String name;

    @Setter
    @Column(nullable = false)
    private Long type;

    @Setter
    @Column(nullable = false)
    private String roadAddress;

    @Setter
    @Column(nullable = false)
    private String postalCode;

    @Setter
    @Column(nullable = false)
    private String detailAddress;

    @Setter
    @Column(nullable = false)
    private Double latitude;

    @Setter
    @Column(nullable = false)
    private Double longitude;

    @OneToMany(mappedBy = "store", cascade = CascadeType.REMOVE)
    private List<Menu> menus = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private Owner owner;

    public Store(String name, Long type, String roadAddress, String postalCode, String detailAddress, Double latitude, Double longitude, Owner owner) {
        this.name = name;
        this.type = type;
        this.roadAddress = roadAddress;
        this.postalCode = postalCode;
        this.detailAddress = detailAddress;
        this.latitude = latitude;
        this.longitude = longitude;
        this.owner = owner;
    }
}

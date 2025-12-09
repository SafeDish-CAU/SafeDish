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
@Table(name = "owners", schema = "safedish")
public class Owner {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false, length = 128)
    private String password;

    @Setter
    @Column(length = 128)
    private String token;

    @OneToMany(mappedBy = "owner", cascade = CascadeType.REMOVE)
    private List<Store> stores = new ArrayList<>();

    public Owner(String email, String password) {
        this.email = email;
        this.password = password;
    }
}

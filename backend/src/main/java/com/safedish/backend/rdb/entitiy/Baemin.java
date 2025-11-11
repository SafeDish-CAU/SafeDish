package com.safedish.backend.rdb.entitiy;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
@Table(name = "baemins", schema = "safedish")
public class Baemin {
    @Id
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "store_id")
    private Store store;

    @Builder
    public Baemin(Long id, Store store) {
        this.id = id;
        this.store = store;
    }
}

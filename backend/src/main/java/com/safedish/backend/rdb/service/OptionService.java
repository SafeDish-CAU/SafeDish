package com.safedish.backend.rdb.service;

import com.safedish.backend.rdb.entity.Menu;
import com.safedish.backend.rdb.entity.Option;
import com.safedish.backend.rdb.entity.Owner;
import com.safedish.backend.rdb.repository.MenuRepository;
import com.safedish.backend.rdb.repository.OptionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class OptionService {
    private final MenuRepository menuRepository;
    private final OptionRepository optionRepository;

    public Option createOption(String token, Long menuId, String name, Long price, Long allergyMask) throws Exception {
        Optional<Menu> menuOpt = menuRepository.findById(menuId);
        if (menuOpt.isEmpty()) {
            throw new Exception("해당하는 메뉴가 없습니다.");
        }

        Menu menu = menuOpt.get();
        Owner owner = menu.getStore().getOwner();
        if (!owner.getToken().equals(token)) {
            throw new Exception("유효하지 않은 토큰입니다.");
        }

        Option option = new Option(name, price, allergyMask, menu);
        optionRepository.save(option);

        return option;
    }

    public Option findByOptionId(Long optionId) throws Exception {
        Optional<Option> optionOpt = optionRepository.findById(optionId);
        if (optionOpt.isEmpty()) {
            throw new Exception("해당하는 옵션이 없습니다.");
        }

        return optionOpt.get();
    }
}
